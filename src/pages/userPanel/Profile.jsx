import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Package, LogOut, ChevronRight, Heart, Settings, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import UpdateProfileModal from '../../components/common/UpdateProfileModal';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/thunk/authThunk';
import { fetchProfile } from '../../redux/thunk/userThunk';
import { updateProfile } from '../../redux/thunk/userThunk';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile, loading: profileLoading } = useSelector((state) => state.user);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const displayUser = profile || user;

    const handleUpdateProfile = async (newData) => {
        try {
            await dispatch(updateProfile(newData)).unwrap();
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error || "Update failed");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Signed out successfully. See you soon!", {
            style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
        });
    };

    if (!displayUser) return null;

    const initials = displayUser.name
        ? displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
            <div className="max-w-4xl mx-auto pb-10">
                {/* Profile Header */}
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                        {/* Avatar Section - Interactive */}
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 sm:w-40 sm:h-40 bg-primary text-white rounded-3xl flex items-center justify-center text-4xl sm:text-6xl font-black shadow-2xl shadow-primary/30 transition-transform group-hover:scale-[1.02] duration-500 overflow-hidden">
                                {displayUser.image ? (
                                    <img src={displayUser.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>
                        </div>

                        {/* User Details - Responsive centering */}
                        <div className="text-center md:text-left sm:mb-10 flex-1 w-full">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{displayUser.name}</h1>
                            <div className="flex flex-col justify-center md:justify-start gap-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] sm:tracking-widest">
                                <span className="flex items-center gap-1.5 lowercase"><Mail size={14} /> {displayUser.email}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {displayUser.location || 'Location not set'}</span>
                            </div>
                        </div>

                        {/* Stats & Actions - Responsive layout */}
                        <div className="flex flex-col items-center  md:items-end gap-6 w-full md:w-auto md:self-stretch">
                            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 w-full md:w-auto ">
                                {[
                                    { label: "Orders", value: "0" },
                                    { label: "Wishlist", value: "0" },
                                ].map((stat, idx) => (
                                    <div key={idx} className="flex-1 sm:flex-none text-center px-4 sm:px-6 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                                        <div className="text-lg sm:text-xl font-black text-primary leading-none mb-1">{stat.value}</div>
                                        <div className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-slate-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Profile Actions Area */}
                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    className="flex items-center justify-between gap-4 px-8 py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all w-full md:w-auto md:min-w-[220px] shadow-lg shadow-slate-900/10 dark:shadow-none group active:scale-95 text-start cursor-pointer border border-transparent"
                                >
                                    <span className="flex items-center gap-3">
                                        <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                        Update Profile
                                    </span>
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-between gap-4 px-8 py-3.5 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 cursor-pointer bg-red-50 dark:hover:bg-red-500/10 transition-all w-full md:w-auto md:min-w-[220px] border border-red-100 dark:border-red-500/10 dark:hover:border-red-500/20 group active:scale-95 text-start"
                                >
                                    <span className="flex items-center gap-3">
                                        <LogOut size={18} />
                                        Logout
                                    </span>
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content Area */}
                <div className="space-y-8">
                    {/* Recent Activity Section */}
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[300px]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
                            <Link to="/profile/orders" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
                        </div>

                        <div className="space-y-4">
                            {[1, 2].map((_, idx) => (
                                <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary/30 transition-all bg-slate-50/30 dark:bg-slate-800/20 hover:shadow-lg hover:shadow-primary/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl group-hover:bg-primary/10 transition-colors shadow-sm shrink-0 border border-slate-50 dark:border-white/5">
                                            <Package className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate pr-4">Handcrafted Peri Peri Makhana</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Order #MC-2024{idx}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center self-start sm:self-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border border-emerald-500/20 shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                        Delivered
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <UpdateProfileModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSave={handleUpdateProfile}
                userData={displayUser}
            />
        </div>
    );
};

export default Profile;
