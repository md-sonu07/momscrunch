import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid2X2, Search, ShoppingCart, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { openSearch } from '../../redux/slice/searchSlice';

const MobileNav = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const isSearchOpen = useSelector((state) => state.search.isOpen);

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Grid2X2, label: 'Explore', path: '/shop' },
        { icon: Search, label: 'Search', onClick: () => dispatch(openSearch()) },
        { icon: ShoppingCart, label: 'Cart', path: '/profile/cart', badge: 2 },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl px-6 py-3 flex justify-between items-center z-300 shadow-2xl shadow-black/10">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path ? location.pathname === item.path : isSearchOpen;

                const content = (
                    <>
                        <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'scale-110' : ''} />
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {item.label}
                        </span>

                        {item.badge && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-black h-3.5 w-3.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse">
                                {item.badge}
                            </span>
                        )}

                        {isActive && (
                            <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />
                        )}
                    </>
                );

                if (item.onClick) {
                    return (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer ${isActive ? 'text-primary' : 'text-slate-400'}`}
                        >
                            {content}
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400'}`}
                        to={item.path}
                    >
                        {content}
                    </Link>
                );
            })}
        </div>
    );
};

export default MobileNav;
