import React, { useState } from 'react';
import { Package, Settings, ChevronRight, User, Heart, ShoppingCart, MapPin, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileSidebar = () => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.user);

    const displayUser = profile || user;

    const initials = displayUser?.name
        ? displayUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    const menuItems = [
        { name: "My Profile", icon: User, path: "/profile" },
        { name: "Active Orders", icon: Package, path: "/profile/orders" },
        { name: "My Wishlist", icon: Heart, path: "/profile/wishlist" },
        { name: "Shopping Cart", icon: ShoppingCart, path: "/profile/cart", hideMobile: true },
        { name: "Saved Addresses", icon: MapPin, path: "/profile/addresses" },
        { name: "Settings", icon: Settings, path: "/profile/settings" },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile "Speed Dial" Menu */}
            <div className="lg:hidden fixed right-6 bottom-30 z-50 flex flex-col items-center gap-3">
                {/* Menu Items Stack */}
                <div
                    className={`flex flex-col items-center gap-3 transition-all duration-300 origin-bottom ${isMenuOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10 pointer-events-none"
                        }`}
                >
                    {menuItems.filter(item => !item.hideMobile).map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={idx}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`p-4 rounded-xl shadow-2xl transition-all group relative border ${isActive
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800"
                                    }`}
                            >
                                <item.icon size={20} />
                                {/* Tooltip */}
                                <span className="absolute right-16 bg-slate-900 text-white text-[10px] px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black uppercase tracking-widest pointer-events-none shadow-xl">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Action Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-4 bg-primary/80 text-white rounded-xl shadow-xl shadow-primary/30 transition-all transform ${isMenuOpen ? "rotate-45" : ""}`}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Desktop Sidebar (Left Sticky) */}
            <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-200px)] sticky top-24 ml-6 my-10 space-y-4">
                <div className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-4xl p-6 flex flex-col h-full shadow-xl shadow-slate-200/50 dark:shadow-none translate-y-0 hover:-translate-y-1 transition-all duration-500">

                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/60 mb-4 ml-1">
                        User Dashboard
                    </div>

                    <div className="flex-1 space-y-1">
                        {menuItems.map((item, idx) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all group ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <item.icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors"} />
                                        {item.name}
                                    </span>
                                    <ChevronRight size={14} className={`transition-transform ${isActive ? "translate-x-1" : "group-hover:translate-x-1 opacity-0 group-hover:opacity-100"}`} />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default ProfileSidebar;
