import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Package, LogOut, ChevronRight, Heart, Settings as SettingsIcon, Camera, Phone, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import UpdateProfileModal from '../../components/common/UpdateProfileModal';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/thunk/authThunk';
import { fetchProfile, updateProfile } from '../../redux/thunk/userThunk';
import { fetchWishlist } from '../../redux/thunk/wishlistThunk';
import { fetchOrders } from '../../redux/thunk/orderThunk';
import { fetchCart } from '../../redux/thunk/cartThunk';
import { selectWishlistCount } from '../../redux/slice/wishlistSlice';
import { selectOrderCount, selectOrders } from '../../redux/slice/orderSlice';
import { selectCartItemCount } from '../../redux/slice/cartSlice';
import Skeleton from '../../components/common/Skeleton';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { profile, loading: profileLoading } = useSelector((state) => state.user);
    const wishlistCount = useSelector(selectWishlistCount);
    const orderCount = useSelector(selectOrderCount);
    const cartCount = useSelector(selectCartItemCount);
    const orders = useSelector(selectOrders);
    const ordersState = useSelector((state) => state.orders);
    const ordersLoading = ordersState?.loading || false;

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchWishlist());
        dispatch(fetchOrders());
        dispatch(fetchCart());
    }, [dispatch]);

    const displayUser = profile || user;

    const handleLogout = async () => {
        try {
            // Always clear local storage first
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // Try to call backend logout (best effort)
            try {
                await dispatch(logout()).unwrap();
                console.log('Backend logout successful');
            } catch (backendError) {
                console.warn('Backend logout failed, but continuing:', backendError);
                // Don't show error to user since we're clearing local storage anyway
            }

            toast.success("Signed out successfully. See you soon!", {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });

            // Always redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Unexpected logout error:', error);

            // Ensure local storage is cleared even on unexpected errors
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // Still redirect to login page
            navigate('/login');
        }
    };

    if (profileLoading && !displayUser) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark pt-10 pb-24">
                <div className="max-w-4xl mx-auto pb-10">
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
                        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                            <Skeleton variant="rectangular" width="160px" height="160px" className="rounded-3xl" />
                            <div className="flex-1 w-full space-y-4">
                                <Skeleton variant="title" width="60%" />
                                <div className="space-y-2">
                                    <Skeleton variant="text" width="40%" />
                                    <Skeleton variant="text" width="30%" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Skeleton variant="rectangular" width="80px" height="60px" className="rounded-xl" />
                                <Skeleton variant="rectangular" width="80px" height="60px" className="rounded-xl" />
                                <Skeleton variant="rectangular" width="80px" height="60px" className="rounded-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 shadow-xl min-h-[300px]">
                        <Skeleton variant="title" width="200px" className="mb-8" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} variant="rectangular" height="80px" className="rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!displayUser) return null;

    const fullName = displayUser ? `${displayUser.first_name || ''} ${displayUser.last_name || ''}`.trim() : '';
    const initials = fullName
        ? fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
            <div className="max-w-4xl mx-auto pb-10">
                {/* Profile Header */}
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                        {/* Avatar Section - Interactive */}
                        <div className="relative group shrink-0">
                            {profileLoading ? (
                                <Skeleton variant="rectangular" className="w-24 h-24 sm:w-40 sm:h-40 rounded-3xl shrink-0" />
                            ) : (
                                <div className="w-24 h-24 sm:w-40 sm:h-40 bg-primary text-white rounded-3xl flex items-center justify-center text-4xl sm:text-6xl font-black shadow-2xl shadow-primary/30 transition-transform group-hover:scale-[1.02] duration-500 overflow-hidden">
                                    {displayUser.profile_pic ? (
                                        <img src={displayUser.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Details - Responsive centering */}
                        <div className="text-center mb-10 md:text-left flex-1 w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {profileLoading ? (
                                    <div className="space-y-4 w-full">
                                        <div className="flex justify-center md:justify-start">
                                            <Skeleton variant="title" className="w-3/5" />
                                        </div>
                                        <div className="space-y-2 flex flex-col items-center md:items-start">
                                            <Skeleton variant="text" className="w-2/5" />
                                            <Skeleton variant="text" className="w-1/4" />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{fullName || 'Name not set'}</h1>
                                        <div className="flex sm:flex-col items-center justify-center md:items-start gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] sm:tracking-widest mt-2">
                                            <span className="flex items-center gap-1.5 lowercase"><Mail size={14} className="shrink-0" /> {displayUser.email || 'Email not set'}</span>
                                            <span className="flex items-center gap-1.5"><Phone size={14} className="shrink-0" /> {displayUser.mobile_no || 'Phone not set'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats & Actions - Responsive layout */}
                        <div className="flex flex-col items-center justify-center  md:items-end gap-6 w-full md:w-auto md:self-stretch">
                            <div className='flex flex-col gap-3 '>
                                <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 w-full md:w-auto ">
                                    {[
                                        { label: "Orders", value: orderCount, path: "/profile/orders" },
                                        { label: "Wishlist", value: wishlistCount, path: "/profile/wishlist" },
                                        { label: "Cart", value: cartCount, path: "/cart" },
                                    ].map((stat, idx) => (
                                        <Link
                                            key={idx}
                                            to={stat.path}
                                            className="flex-1 sm:flex-none text-center px-4 sm:px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:border-primary/30 hover:shadow-md hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-all active:scale-95 group"
                                        >
                                            <div className="text-lg sm:text-xl font-black text-primary leading-none mb-1 group-hover:scale-110 transition-transform">{stat.value}</div>
                                            <div className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-slate-400 group-hover:text-primary transition-colors">{stat.label}</div>
                                        </Link>
                                    ))}
                                </div>
                                {displayUser?.roles?.includes('admin') && (
                                    <a
                                        href="/admin/"
                                        className="group h-[52px] mt-2 w-full flex items-center justify-between gap-4 px-6 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-primary dark:hover:bg-primary hover:text-white transition-all active:scale-95 whitespace-nowrap"
                                    >
                                        <span className="flex items-center gap-3">
                                            <LayoutDashboard size={18} className="text-primary group-hover:text-white transition-colors" />
                                            Admin Panel
                                        </span>
                                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                ) }
                                    <button
                                        onClick={handleLogout}
                                        className="group h-[52px] w-full flex items-center justify-between gap-4 px-6 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 cursor-pointer bg-white dark:bg-slate-900/50 dark:hover:bg-red-500/10 transition-all border border-red-100 dark:border-red-500/10 dark:hover:border-red-500/20 active:scale-95 text-start"
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
                            {ordersLoading ? (
                                [1, 2, 3].map((i) => (
                                    <Skeleton key={i} variant="rectangular" height="80px" className="rounded-xl" />
                                ))
                            ) : orders && orders.length > 0 ? (
                                orders.slice(0, 3).map((order, idx) => {
                                    const firstItem = order.items?.[0];
                                    const statusColors = {
                                        pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                        paid: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                        shipped: "bg-primary/10 text-primary border-primary/20",
                                        delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                        cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
                                    };

                                    return (
                                        <div key={order.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary/30 transition-all bg-slate-50/30 dark:bg-slate-800/20 hover:shadow-lg hover:shadow-primary/5">
                                            <div className="flex items-center gap-4">
                                                <div className=" bg-white dark:bg-slate-900 rounded-xl group-hover:bg-primary/10 transition-colors shadow-sm shrink-0 border border-slate-50 dark:border-white/5">
                                                    {firstItem?.product_image ? (
                                                        <img src={firstItem.product_image} alt={firstItem.product_variant_name} className="w-10 h-10 object-cover rounded-md" />
                                                    ) : (
                                                        <Package className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate pr-4">
                                                        {firstItem?.product_variant_name || 'Multiple Items'}
                                                        {order.items?.length > 1 && <span className="text-[10px] text-slate-400 font-medium ml-1">+{order.items.length - 1} more</span>}
                                                    </h4>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Order #{order.id}</p>
                                                </div>
                                            </div>

                                            <div className={`flex items-center self-start sm:self-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm ${statusColors[order.status] || "bg-slate-500/10 text-slate-500 border-slate-500/20"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-sm ${order.status === 'delivered' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-current'}`}></span>
                                                {order.status_display || order.status}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-10">
                                    <Package className="mx-auto text-slate-300 mb-3" size={40} />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent activity yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Profile;
