import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSearch, setSearchQuery } from '../../redux/slice/searchSlice';
import { Search, ArrowRight, Package, TrendingUp, Sparkles, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
    { id: 1, name: "Rajasthani Garlic Achar", category: "Achar", price: 149, image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=400" },
    { id: 2, name: "Traditional Mango Achar", category: "Achar", price: 249, image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=400" },
    { id: 3, name: "Spicy Lemon Achar", category: "Achar", price: 169, image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=400" },
    { id: 4, name: "Authentic Wheat Thekua", category: "Thekua", price: 199, image: "https://images.unsplash.com/photo-1605085112728-3cdbb6241f2d?q=80&w=400" },
    { id: 5, name: "Gud (Jaggery) Thekua", category: "Thekua", price: 249, image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=400" },
    { id: 6, name: "Mix Dry Fruit Thekua", category: "Thekua", price: 349, image: "https://images.unsplash.com/photo-1599596395112-9dae07b8b2cb?q=80&w=400" }
];

const SearchDropdown = ({ isOpen, query }) => {
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const filteredProducts = query
        ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleProductClick = (id) => {
        dispatch(closeSearch());
        // navigate(`/product/${id}`);
    };

    return (
        <div className="absolute top-full mt-3 right-0 w-[600px] bg-white dark:bg-slate-950 rounded-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 overflow-hidden z-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-6">
                {!query ? (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 inline-flex items-center gap-2">
                                <TrendingUp size={12} className="text-primary" />
                                Trending Searches
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Achar', 'Thekua'].map(trend => (
                                    <button
                                        key={trend}
                                        onClick={() => dispatch(setSearchQuery(trend))}
                                        className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer"
                                    >
                                        {trend}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 inline-flex items-center gap-2">
                                <Sparkles size={12} className="text-amber-500" />
                                Popular Categories
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'Traditional Achar', icon: Package },
                                    { name: 'Crispy Thekua', icon: Flame },
                                ].map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => dispatch(closeSearch())}
                                        className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl hover:border-primary transition-all group text-left"
                                    >
                                        <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-100 dark:border-white/5 shadow-sm">
                                            <cat.icon size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{cat.name}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Explore All</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Matching Results</h3>
                            <span className="text-[11px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">{filteredProducts.length} Found</span>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid gap-3">
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                                    >
                                        <div className="size-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-white/5">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-1 block">
                                                {product.category}
                                            </span>
                                            <h4 className="text-base font-black text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">{product.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">₹{product.price}</span>
                                                <span className="text-[10px] font-bold text-slate-400 line-through">₹{product.price + 60}</span>
                                            </div>
                                        </div>
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Search size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight">No snacks found</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">Try searching for something else like "Mango" or "Thekua".</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                    New snacks added weekly
                </span>
                <Link
                    to="/shop"
                    onClick={() => dispatch(closeSearch())}
                    className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                    View All Products
                </Link>
            </div>
        </div>
    );
};

export default SearchDropdown;
