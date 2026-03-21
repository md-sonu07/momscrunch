import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, CheckCircle2, ArrowRight, Navigation2, Loader2 } from 'lucide-react';
import { storeSettingsAPI } from '../../api/store.api';

const PincodePopup = ({ isOpen, onClose, onSave, currentPincode }) => {
    const [pincode, setPincode] = useState(currentPincode || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setPincode(currentPincode || '');
            setError('');
        }
    }, [isOpen, currentPincode]);

    const extractValidPincode = (postcode) => {
        if (!postcode) return null;
        // Handle range formats like "110001-110099" — take the first part
        const parts = postcode.split(/[-–,]/);
        const cleaned = (parts[0] || '').replace(/\D/g, '');
        // Indian pincodes are exactly 6 digits and start with 1-9
        if (/^[1-9]\d{5}$/.test(cleaned)) return cleaned;
        return null;
    };

    const fetchPincodeFromCoords = async (latitude, longitude) => {
        // Primary: Nominatim with high zoom for precise address
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                { headers: { 'User-Agent': 'MomsCrunch-WebApp/1.0' } }
            );
            if (response.ok) {
                const data = await response.json();
                const pincode = extractValidPincode(data?.address?.postcode);
                if (pincode) return pincode;
            }
        } catch {
            // Nominatim failed, try fallback
        }

        // Fallback: BigDataCloud free reverse geocoding
        try {
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (response.ok) {
                const data = await response.json();
                const pincode = extractValidPincode(data?.postcode);
                if (pincode) return pincode;
            }
        } catch {
            // Fallback also failed
        }

        return null;
    };

    const fetchCurrentLocationPincode = () => {
        setIsLocating(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const pincode = await fetchPincodeFromCoords(latitude, longitude);

                    if (pincode) {
                        setPincode(pincode);
                    } else {
                        setError('Pincode not found for this area. Please enter manually.');
                    }
                } catch (err) {
                    setError('Error fetching location. Please enter manually.');
                } finally {
                    setIsLocating(false);
                }
            },
            (geoError) => {
                const messages = {
                    1: 'Location access denied. Please allow location permission.',
                    2: 'Location unavailable. Please enter pincode manually.',
                    3: 'Location request timed out. Please try again.',
                };
                setError(messages[geoError.code] || 'Could not get location.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleValidate = async () => {
        if (!/^\d{6}$/.test(pincode)) {
            setError('Invalid Pincode');
            setSuccess('');
            return;
        }

        setIsValidating(true);
        setError('');
        setSuccess('');

        try {
            const data = await storeSettingsAPI.checkPincode(pincode);

            if (data.allowed) {
                setSuccess(data.message || 'Delivery Available!');
                // Small delay so user can see the success message
                setTimeout(() => {
                    onSave(pincode);
                    onClose();
                }, 1000);
            } else {
                setError(data.message || 'Area Not Covered');
            }
        } catch (err) {
            setError('Could not connect to validation service. Please check your internet or try again later.');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div
            ref={popupRef}
            className="fixed md:absolute top-[76px] md:top-full mt-0 md:mt-4 left-4 right-4 md:left-auto md:right-0 md:translate-x-0 md:w-[290px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-white/5 z-120 overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-auto max-w-[340px] md:mx-0"
        >
            <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MapPin size={12} className="text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">Delivery Area</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1">
                        <X size={18} />
                    </button>
                </div>
                <div className="min-h-[40px] flex items-center pl-1 mb-4">
                    {error ? (
                        <p className="text-[12px] text-red-500 font-bold leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                            <i className="fa-solid fa-circle-exclamation mr-1.5"></i>
                            {error}
                        </p>
                    ) : success ? (
                        <p className="text-[12px] text-emerald-500 font-bold leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                            <i className="fa-solid fa-circle-check mr-1.5"></i>
                            {success}
                        </p>
                    ) : (
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Check product availability and delivery estimates in your area.
                        </p>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="relative group">
                        <input
                            type="text"
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => {
                                setPincode(e.target.value.replace(/\D/g, ''));
                                setError('');
                                setSuccess('');
                            }}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border-2 ${error ? 'border-red-500/20' : success ? 'border-emerald-500/20' : 'border-slate-100 dark:border-slate-800 focus:border-primary/20'} rounded-xl py-3 px-4 outline-none transition-all text-sm font-black tracking-[0.3em] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600`}
                            placeholder="000000"
                            autoFocus
                        />

                    </div>

                    <button
                        onClick={fetchCurrentLocationPincode}
                        disabled={isLocating}
                        className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg transition-all border border-primary/20 hover:border-primary/40 disabled:opacity-50 group cursor-pointer"
                    >
                        {isLocating ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Navigation2 size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                        {isLocating ? 'Fetching...' : 'Use Current Location'}
                    </button>
                </div>

                <button
                    onClick={handleValidate}
                    disabled={isValidating || isLocating}
                    className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95 shadow-lg shadow-slate-900/10 dark:shadow-none"
                >
                    {isValidating ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            Verify Pincode
                            <ArrowRight size={14} />
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-3.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                    <CheckCircle2 size={10} className="text-green-500" />
                    Secure & Accurate estimates
                </div>
            </div>

            {/* Pointer / Arrow - Only on desktop */}
            <div className="hidden md:block absolute -top-1.5 right-10 w-3 h-3 bg-white dark:bg-slate-900 border-l border-t border-slate-200/60 dark:border-white/5 rotate-45"></div>
        </div>
    );
};

export default PincodePopup;
