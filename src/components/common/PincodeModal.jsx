import React, { useState, useEffect } from 'react';
import { MapPin, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { storeSettingsAPI } from '../../api/store.api';

const PincodeModal = ({ isOpen, onClose, onSave, currentPincode }) => {
    const [pincode, setPincode] = useState(currentPincode || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPincode(currentPincode || '');
            setError('');
            setSuccess('');
        }
    }, [isOpen, currentPincode]);

    if (!isOpen) return null;

    const handleValidate = async () => {
        if (!/^\d{6}$/.test(pincode)) {
            setError('Please enter a valid 6-digit pincode');
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
                setTimeout(() => {
                    onSave(pincode);
                    onClose();
                }, 1200);
            } else {
                setError(data.message || 'Area Not Covered');
            }
        } catch (err) {
            setError('Validation failed. Try again.');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                {/* Header with Background Pattern */}
                <div className="relative h-32 bg-primary flex flex-col items-center justify-center text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150 rotate-12"></div>
                    <MapPin className="w-12 h-12 mb-2 relative z-10 animate-bounce" />
                    <h3 className="text-xl font-black uppercase tracking-wider relative z-10">Select Delivery Location</h3>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white text-white hover:text-primary rounded-full transition-all duration-300"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="min-h-[50px] mb-6 flex flex-col items-center justify-center">
                        {error ? (
                            <p className="text-red-500 text-sm font-bold text-center animate-in fade-in slide-in-from-top-2 duration-300">
                                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                                {error}
                            </p>
                        ) : success ? (
                            <p className="text-emerald-500 text-sm font-bold text-center animate-in fade-in slide-in-from-top-2 duration-300">
                                <i className="fa-solid fa-circle-check mr-2"></i>
                                {success}
                            </p>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center">
                                Enter your delivery pincode to see product availability and delivery estimates.
                            </p>
                        )}
                    </div>

                    <div className="relative mb-6 group">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary'}`}>
                            <MapPin size={20} />
                        </div>
                        <input
                            type="text"
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => {
                                setPincode(e.target.value.replace(/\D/g, ''));
                                setError('');
                                setSuccess('');
                            }}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border-2 ${error ? 'border-red-500/50' : success ? 'border-emerald-500/50' : 'border-slate-100 dark:border-slate-800 group-focus-within:border-primary/30'} rounded-2xl py-4 pl-12 pr-4 outline-none transition-all duration-300 text-lg font-black tracking-[0.2em] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600`}
                            placeholder="Enter Pincode"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleValidate}
                            disabled={isValidating || success}
                            className={`w-full ${success ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'} text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group`}
                        >
                            {isValidating ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Apply Pincode
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mt-2">
                            <CheckCircle2 size={14} />
                            Safe & Fast Delivery Guaranteed
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PincodeModal;
