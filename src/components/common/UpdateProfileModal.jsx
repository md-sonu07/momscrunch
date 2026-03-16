import React, { useState, useEffect, useRef } from 'react';
import { X, User, Mail, MapPin, Phone, Camera, Save, ArrowRight, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../redux/thunk/userThunk';

const UpdateProfileModal = ({ isOpen, onClose, onSave, userData }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile_no: '',
        profile_pic: ''
    });

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    // Password change states
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                mobile_no: userData.mobile_no || '',
                profile_pic: userData.profile_pic || ''
            });
            setPreviewImage(userData.profile_pic || '');
        }
    }, [userData, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profile_pic: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Handle Password Change if active
            if (isChangingPassword) {
                if (passwordData.new_password !== passwordData.confirm_password) {
                    toast.error("New passwords do not match!");
                    setLoading(false);
                    return;
                }
                if (passwordData.new_password.length < 8) {
                    toast.error("Password must be at least 8 characters long");
                    setLoading(false);
                    return;
                }

                await dispatch(changePassword({
                    old_password: passwordData.old_password,
                    new_password: passwordData.new_password
                })).unwrap();
                toast.success("Password changed successfully!");
            }

            // 2. Handle Profile Update
            const submitData = { ...formData };

            // If profile_pic is a string (URL), don't send it to backend 
            // as it will fail validation or try to re-upload the same URL
            if (typeof submitData.profile_pic === 'string') {
                delete submitData.profile_pic;
            }

            // Remove email as it's read-only
            delete submitData.email;

            await onSave(submitData);
            onClose();

            // Reset password data
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            setIsChangingPassword(false);
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error || "Update failed. Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Glass Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/50 dark:border-slate-800 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative px-8 pt-10 pb-6 shrink-0 bg-gradient-to-b from-slate-50/50 dark:from-slate-800/50 to-transparent">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
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
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-100 dark:border-slate-800 flex items-center gap-6 group">
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <div className="w-20 h-20 bg-primary text-white rounded-xl flex items-center justify-center text-3xl font-black shadow-xl shadow-primary/20 overflow-hidden">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    (formData.first_name || formData.last_name) ? `${formData.first_name || ''} ${formData.last_name || ''}`.trim().split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
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
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">First Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                                    placeholder="Enter your first name"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Last Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

                        {/* Email - READ ONLY */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Mail Subscription</label>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Read Only</span>
                            </div>
                            <div className="relative group opacity-70">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    readOnly
                                    value={formData.email}
                                    className="w-full bg-slate-100/50 dark:bg-slate-800/30 border border-transparent rounded-xl pl-12 pr-6 py-4 text-sm font-bold outline-none cursor-not-allowed dark:text-slate-400"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Section Toggle */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setIsChangingPassword(!isChangingPassword)}
                                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isChangingPassword ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                            >
                                <Lock size={14} />
                                {isChangingPassword ? 'Cancel Password Change' : 'Change Password?'}
                            </button>
                        </div>

                        {/* Integrated Password Change Form */}
                        {isChangingPassword && (
                            <div className="space-y-4 p-5 bg-primary/5 rounded-2xl border border-primary/10 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center gap-2 mb-2 ml-1">
                                    <KeyRound size={14} className="text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Security Update</span>
                                </div>

                                {/* Old Password */}
                                <div className="space-y-1.5">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={passwordData.old_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                            required={isChangingPassword}
                                            className="w-full bg-white dark:bg-slate-900 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-12 py-3.5 text-xs font-bold outline-none transition-all dark:text-white"
                                            placeholder="Current Password"
                                        />
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="space-y-1.5">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            required={isChangingPassword}
                                            className="w-full bg-white dark:bg-slate-900 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-12 py-3.5 text-xs font-bold outline-none transition-all dark:text-white"
                                            placeholder="New Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                        >
                                            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={passwordData.confirm_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                            required={isChangingPassword}
                                            className="w-full bg-white dark:bg-slate-900 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-12 py-3.5 text-xs font-bold outline-none transition-all dark:text-white"
                                            placeholder="Confirm New Password"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Mobile Number */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="tel"
                                        value={formData.mobile_no}
                                        onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-primary/30 rounded-xl pl-12 pr-6 py-4 text-xs font-bold outline-none transition-all dark:text-white"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            {/* Space filler to keep grid alignment if needed, or remove location if not backend supported */}
                            {/* Removing Location as it is not in backend User serializer */}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-black hover:text-slate-600 dark:hover:text-white  bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Nevermind
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-[2] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-xl font-black text-11px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 dark:shadow-none transition-all flex items-center justify-center gap-3 group active:scale-95 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary dark:hover:bg-primary hover:text-white'}`}
                        >
                            {loading ? 'Saving...' : 'Save'}
                            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
