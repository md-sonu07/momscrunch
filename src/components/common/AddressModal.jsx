import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Navigation2, Home, Briefcase, Plus, Check, Search, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to handle map movement
function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 18); // Zoom in closer for "Very Precise" feel
        }
    }, [center, map]);
    return null;
}

// Custom component for location selection on click
function LocationMarker({ onLocationSelect, position }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

const AddressModal = ({ isOpen, onClose, onSave, initialData }) => {
    const { currentLocation } = useSelector((state) => state.location);

    const [formData, setFormData] = useState(initialData || {
        type: 'Home',
        name: '',
        phone: '',
        address: '',
        landmark: '',
        city: currentLocation?.city || 'Purnia',
        state: 'Bihar',
        pincode: currentLocation?.pincode || '',
    });

    const [mapCenter, setMapCenter] = useState([25.7711, 87.4753]); // Default Purnia, Bihar
    const [selectedPos, setSelectedPos] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.lat && initialData.lng) {
                setMapCenter([initialData.lat, initialData.lng]);
                setSelectedPos([initialData.lat, initialData.lng]);
            }
        } else if (isOpen) {
            setFormData(prev => ({
                ...prev,
                city: currentLocation?.city || prev.city,
                pincode: currentLocation?.pincode || prev.pincode
            }));
        }
    }, [initialData, isOpen, currentLocation]);

    const fetchAddress = async (lat, lng) => {
        setStatusMsg('Analyzing area...');
        try {
            // Using a higher zoom level (18) for reverse geocoding to get house/building level details
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();

            if (data && data.address) {
                const a = data.address;

                // Extremely Precise Parsing for Indian Locations
                const road = a.road || a.pedestrian || a.suburb || '';
                const police = a.police ? `${a.police} Thana` : '';
                const neighborhood = a.neighbourhood || a.suburb || a.residential || a.city_district || '';
                const locality = a.hamlet || a.village || a.town || a.suburb || '';
                const district = a.city || a.district || a.county || '';

                // Match user's "Purnia Madhuban Thana" style
                // Prioritizing specific landmarks and Thana
                let descriptiveParts = [road, police, neighborhood, locality].filter(Boolean);

                // If the structured address is too thin, use the first few parts of the display_name
                if (descriptiveParts.length < 2) {
                    const rawParts = data.display_name.split(',');
                    descriptiveParts = rawParts.slice(0, 3).map(p => p.trim());
                }

                const fullDisplayAddress = descriptiveParts.join(', ');
                const cityValue = a.city || a.town || a.district || a.county || '';
                const stateValue = a.state || '';
                const pinValue = a.postcode ? a.postcode.replace(/\D/g, '').substring(0, 6) : '';

                setFormData(prev => ({
                    ...prev,
                    address: fullDisplayAddress,
                    city: cityValue,
                    state: stateValue,
                    pincode: pinValue || prev.pincode
                }));
                setStatusMsg('Location Captured!');
                toast.success("Location pinpointed!", {
                    style: {
                        borderRadius: '16px',
                        background: '#0f172a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    },
                });
            } else {
                setStatusMsg('Location not found');
                toast.error("Could not resolve address");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            setStatusMsg('Network Error');
        } finally {
            setIsLocating(false);
            setTimeout(() => setStatusMsg(''), 2000);
        }
    };

    const bestPointRef = useRef(null);
    const isActiveRef = useRef(false);

    const handlePickLocation = () => {
        setIsLocating(true);
        isActiveRef.current = true;
        bestPointRef.current = null;
        setStatusMsg('Waking up GPS...');

        if (!navigator.geolocation) {
            setStatusMsg('Location not supported');
            toast.error("Browser doesn't support geolocation");
            setIsLocating(false);
            return;
        }

        // Use watchPosition for deep satellite lock refinement
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                // Track the best (lowest accuracy value) point found so far
                if (!bestPointRef.current || accuracy < bestPointRef.current.accuracy) {
                    bestPointRef.current = { latitude, longitude, accuracy };

                    const newPos = [latitude, longitude];
                    setMapCenter(newPos);
                    setSelectedPos(newPos);
                }

                // If accuracy is better than 20m, we have a "Deep Lock"
                if (accuracy <= 20) {
                    setStatusMsg(`Precise Lock (${Math.round(accuracy)}m)`);
                    fetchAddress(latitude, longitude);
                    navigator.geolocation.clearWatch(watchId);
                    isActiveRef.current = false;
                } else {
                    setStatusMsg(`Refining GPS (${Math.round(accuracy)}m)...`);
                }
            },
            (error) => {
                const errors = { 1: 'GPS Denied', 2: 'Signal Weak', 3: 'Sync Timeout' };
                setStatusMsg(error.code === 3 && bestPointRef.current ? 'Using best signal' : (errors[error.code] || 'Sync Failed'));

                if (bestPointRef.current && isActiveRef.current) {
                    fetchAddress(bestPointRef.current.latitude, bestPointRef.current.longitude);
                } else {
                    setIsLocating(false);
                }
                navigator.geolocation.clearWatch(watchId);
                isActiveRef.current = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );

        // Auto-resolve to best point after 10 seconds if a deep lock isn't found
        setTimeout(() => {
            if (isActiveRef.current) {
                navigator.geolocation.clearWatch(watchId);
                isActiveRef.current = false;
                if (bestPointRef.current) {
                    setStatusMsg(`Point Fixed (${Math.round(bestPointRef.current.accuracy)}m)`);
                    fetchAddress(bestPointRef.current.latitude, bestPointRef.current.longitude);
                } else {
                    setStatusMsg('Poor Signal');
                    setIsLocating(false);
                }
            }
        }, 10000);
    };

    const handleMapClick = (latlng) => {
        const newPos = [latlng.lat, latlng.lng];
        setSelectedPos(newPos);
        fetchAddress(latlng.lat, latlng.lng);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-500 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-white dark:border-white/5 flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Left: Map Section */}
                <div className="relative w-full md:w-1/2 h-80 md:h-auto bg-slate-100 dark:bg-slate-900 overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5">
                    <MapContainer
                        center={mapCenter}
                        zoom={16} // Zoomed in closer for better precision
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapUpdater center={mapCenter} />
                        <LocationMarker onLocationSelect={handleMapClick} position={selectedPos} />
                    </MapContainer>

                    {/* Status Feedback */}
                    {statusMsg && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-400 animate-in slide-in-from-top-2">
                            <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                                {isLocating ? (
                                    <div className="size-2 bg-primary rounded-full animate-pulse" />
                                ) : (
                                    <Check size={12} className="text-green-500" />
                                )}
                                <span className="text-[10px] text-white font-black uppercase tracking-widest">{statusMsg}</span>
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 left-4 right-4 z-400 flex flex-col gap-2">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2.5 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-3 shadow-xl">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Search size={14} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search neighborhood..."
                                className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-800 dark:text-white w-full"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 z-400 flex flex-col gap-3">
                        <button
                            onClick={handlePickLocation}
                            disabled={isLocating}
                            className={`bg-primary text-white p-4 rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-950 flex items-center justify-center group cursor-pointer ${isLocating ? 'animate-pulse' : ''}`}
                            title="Find My Location"
                        >
                            <Navigation2 size={20} className={isLocating ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-20 z-400">
                        <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-3 rounded-xl border border-slate-100 dark:border-white/5 shadow-xl">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Point selected</p>
                            <p className="text-[10px] font-bold text-slate-800 dark:text-white truncate flex items-center gap-2">
                                <MapPin size={12} className="text-primary" />
                                {selectedPos ? `${selectedPos[0].toFixed(5)}, ${selectedPos[1].toFixed(5)}` : 'Tap on map or use GPS'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Form Section */}
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950">
                    <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 dark:border-white/5">
                        <div className="relative">
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                                Address <span className="text-primary italic">Details</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Location</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl text-slate-400 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Save address as</label>
                            <div className="flex items-center gap-2 sm:gap-3">
                                {[
                                    { label: 'Home', icon: Home },
                                    { label: 'Work', icon: Briefcase },
                                    { label: 'Other', icon: MapPin },
                                ].map((type) => (
                                    <button
                                        key={type.label}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type.label })}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.type === type.label
                                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <type.icon size={15} />
                                        {type.label}
                                        {formData.type === type.label && <Check size={12} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Receiver Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-4 text-xs font-bold focus:border-primary/40 focus:bg-white transition-all outline-none"
                                    placeholder="e.g. Danish Farhan"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-4 text-xs font-bold focus:border-primary/40 focus:bg-white transition-all outline-none"
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center justify-between h-5 ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pincode</label>
                                    <button
                                        type="button"
                                        onClick={handlePickLocation}
                                        className="md:hidden flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 active:scale-95 transition-all"
                                    >
                                        <Navigation2 size={10} className={isLocating ? 'animate-spin' : ''} />
                                        {isLocating ? 'Locating...' : 'Locate Me'}
                                    </button>
                                </div>
                                <input
                                    required
                                    type="text"
                                    maxLength={6}
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-4 text-xs font-bold focus:border-primary/40 focus:bg-white transition-all outline-none"
                                    placeholder="6-digit Pincode"
                                />
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center h-5 ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nearby / Landmark</label>
                                </div>
                                <input
                                    type="text"
                                    value={formData.landmark}
                                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-4 text-xs font-bold focus:border-primary/40 focus:bg-white transition-all outline-none"
                                    placeholder="e.g. Near Madhuban Thana"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Complete Detailed Address</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl px-5 py-4 text-xs font-bold focus:border-primary/40 focus:bg-white transition-all outline-none resize-none leading-relaxed"
                                placeholder="House / Flat No, Local Area Name, Sector etc."
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <Check size={16} />
                                {initialData ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
