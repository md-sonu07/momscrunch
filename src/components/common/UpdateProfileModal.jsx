import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, MapPin, Phone, Camera, Save, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UpdateProfileModal = ({ isOpen, onClose, onSave, userData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        phone: '',
        avatar: '',
        image: ''
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                location: userData.location || '',
                phone: userData.phone || '+91 98765 43210', // Default mock phone
                avatar: userData.avatar || '',
                image: userData.image || ''
            });
        }
    }, [userData, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        toast.success("Profile updated perfectly!", {
            style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Glass Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-800 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative px-8 pt-10 pb-6 shrink-0 bg-gradient-to-b from-slate-50/50 dark:from-slate-800/50 to-transparent">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Edit Profile</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Settings & Personal Info</p>
                        </div>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <form onSubmit={handleSubmit} className="px-8 pb-10 overflow-y-auto custom-scrollbar space-y-6">

                    {/* Avatar Preview & Info */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 flex items-center gap-6 group">
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl shadow-primary/20 overflow-hidden">
                                {formData.image ? (
                                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute -bottom-1 -right-1 p-2 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 text-primary group-hover:rotate-12 transition-transform cursor-pointer hover:bg-primary hover:text-white"
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Avatar & Identity</h4>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest">Your visual representation in the Mom's Crunch community</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Full Identity</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Mail Subscription</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Connect Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold outline-none transition-all dark:text-white"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Home Base</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold outline-none transition-all dark:text-white"
                                        placeholder="City, State"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Nevermind
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 dark:shadow-none hover:bg-primary dark:hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 group active:scale-95 cursor-pointer"
                        >
                            Save
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
