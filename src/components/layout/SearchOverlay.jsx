import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSearch, setSearchQuery } from '../../redux/slice/searchSlice';
import { Search, X, ArrowRight, Package, History, TrendingUp, Sparkles, Flame, Home, Grid2X2, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const products = [
    { id: 1, name: "Rajasthani Garlic Achar", category: "Achar", price: 149, image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=400" },
    { id: 2, name: "Traditional Mango Achar", category: "Achar", price: 249, image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=400" },
    { id: 3, name: "Spicy Lemon Achar", category: "Achar", price: 169, image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=400" },
    { id: 4, name: "Authentic Wheat Thekua", category: "Thekua", price: 199, image: "https://images.unsplash.com/photo-1605085112728-3cdbb6241f2d?q=80&w=400" },
    { id: 5, name: "Gud (Jaggery) Thekua", category: "Thekua", price: 249, image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=400" },
    { id: 6, name: "Mix Dry Fruit Thekua", category: "Thekua", price: 349, image: "https://images.unsplash.com/photo-1599596395112-9dae07b8b2cb?q=80&w=400" }
];

const SearchOverlay = () => {
    const { query, isOpen } = useSelector((state) => state.search);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);

    // Auto-close search and clear query on navigation
    useEffect(() => {
        dispatch(closeSearch());
        dispatch(setSearchQuery(''));
    }, [location.pathname, dispatch]);

    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth >= 1024) return;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const timer = setTimeout(() => inputRef.current?.focus(), 150);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = '';
            };
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // Only render SearchOverlay on mobile/tablet (less than lg breakpoint)
    if (!isOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) return null;

    const filteredProducts = query
        ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleSearch = (e) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleProductClick = (id) => {
        dispatch(closeSearch());
        // navigate(`/product/${id}`); // Assuming product page exists
    };

    return (
        <div className="lg:hidden fixed inset-0 z-200 flex items-center justify-center p-4 transition-all duration-300">
            {/* Backdrop - High Blur Effect */}
            <div
                className="absolute inset-0 bg-slate-950/20 dark:bg-black/40 backdrop-blur-md animate-in fade-in duration-500"
                onClick={() => dispatch(closeSearch())}
            />

            {/* Popup Container - Centered Mobile Box */}
            <div className="relative w-full max-h-[80vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20 dark:border-white/5">
                {/* Search Header */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 shrink-0">
                    <div className="px-5 h-16 flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Search size={18} strokeWidth={2.5} />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Find your favorite snacks..."
                            className="flex-1 bg-transparent border-none outline-none text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 tracking-tight"
                        />
                        <button
                            onClick={() => dispatch(closeSearch())}
                            className="size-8 shrink-0 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-primary transition-all cursor-pointer border border-slate-100 dark:border-white/5"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-6 py-8">
                        {!query ? (
                            <div className="space-y-10">
                                {/* Trending Chips */}
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Trending</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Garlic Achar', 'Thekua', 'Honey'].map((trend) => (
                                            <button
                                                key={trend}
                                                onClick={() => dispatch(setSearchQuery(trend))}
                                                className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer"
                                            >
                                                {trend}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Quick Categories */}
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                        <div className="size-1 rounded-full bg-primary" />
                                        Browse Categories
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: 'Traditional Achar', icon: Package, color: 'text-amber-500' },
                                            { name: 'Crispy Thekua', icon: Flame, color: 'text-orange-500' }
                                        ].map((cat) => (
                                            <Link
                                                key={cat.name}
                                                to="/shop"
                                                onClick={() => dispatch(closeSearch())}
                                                className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl active:scale-95 transition-all text-center"
                                            >
                                                <div className={`size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center ${cat.color} shadow-sm border border-slate-100 dark:border-white/5`}>
                                                    <cat.icon size={20} />
                                                </div>
                                                <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                {/* Popular Picks */}
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Popular Hits</h3>
                                    <div className="space-y-3">
                                        {products.slice(0, 2).map((product) => (
                                            <div key={product.id} className="group flex items-center gap-3 cursor-pointer" onClick={() => handleProductClick(product.id)}>
                                                <div className="size-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-[13px] font-black text-slate-800 dark:text-slate-100 truncate">{product.name}</h5>
                                                    <span className="text-[11px] font-bold text-primary">₹{product.price}</span>
                                                </div>
                                                <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Results for "{query}"</span>
                                    <span className="text-[10px] font-bold text-primary">{filteredProducts.length} Found</span>
                                </div>

                                {filteredProducts.length > 0 ? (
                                    <div className="space-y-3">
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => handleProductClick(product.id)}
                                                className="group flex items-center gap-4 p-3 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                                            >
                                                <div className="size-16 rounded-xl overflow-hidden shrink-0">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-1 block">
                                                        {product.category}
                                                    </span>
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{product.name}</h4>
                                                    <span className="text-xs font-black text-slate-900 dark:text-white">₹{product.price}</span>
                                                </div>
                                                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Search size={40} className="text-slate-200 dark:text-slate-800 mb-4" />
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">No snacks found</h3>
                                        <p className="text-xs text-slate-400 max-w-[200px]">We couldn't find any snack matching your search.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
