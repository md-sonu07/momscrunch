import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSearch, setSearchQuery } from '../../redux/slice/searchSlice';
import { getProducts } from '../../redux/thunk/productThunk';
import { Search, ArrowRight, Package, TrendingUp, Sparkles, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const fallbackImage = "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop";
const categoryIcons = [Package, Flame, Sparkles, TrendingUp];

const getMediaBaseUrl = () => {
    const apiBase = import.meta.env.VITE_API_URL;
    if (apiBase) {
        return apiBase.replace(/\/$/, '');
    }
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return '';
};

const resolveImageUrl = (product) => {
    const rawImage = product.image || product.product_image || product.images?.[0]?.productimages;
    if (!rawImage) return fallbackImage;
    if (/^https?:\/\//i.test(rawImage)) return rawImage;
    if (rawImage.startsWith('/')) return `${getMediaBaseUrl()}${rawImage}`;
    return `${getMediaBaseUrl()}/${rawImage}`;
};

const SearchDropdown = ({ isOpen, query }) => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.product);

    React.useEffect(() => {
        if (isOpen && products.length === 0 && !loading) {
            dispatch(getProducts());
        }
    }, [dispatch, isOpen, products.length, loading]);

    if (!isOpen) return null;

    const filteredProducts = query
        ? products
            .filter((product) =>
                product.name?.toLowerCase().includes(query.toLowerCase()) ||
                product.subcategory_name?.toLowerCase().includes(query.toLowerCase()) ||
                product.category_name?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 6)
        : [];

    const popularCategories = Object.values(
        products.reduce((accumulator, product) => {
            const displayName = product.subcategory_name || product.category_name;
            if (!displayName) return accumulator;

            if (!accumulator[displayName]) {
                accumulator[displayName] = {
                    name: displayName,
                    categoryName: product.category_name || displayName,
                    subcategoryName: product.subcategory_name || '',
                    count: 0,
                };
            }

            accumulator[displayName].count += 1;
            return accumulator;
        }, {})
    )
        .sort((first, second) => second.count - first.count)
        .slice(0, 4);

    const getCategoryHref = (category) => {
        const params = new URLSearchParams();

        if (category.categoryName) {
            params.set('category', category.categoryName);
        }

        if (category.subcategoryName) {
            params.set('subcategory', category.subcategoryName);
        }

        return `/shop?${params.toString()}`;
    };

    const handleProductClick = (id) => {
        dispatch(closeSearch());
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
                                {popularCategories.map((cat, index) => {
                                    const Icon = categoryIcons[index % categoryIcons.length];

                                    return (
                                    <Link
                                        key={cat.name}
                                        to={getCategoryHref(cat)}
                                        onClick={() => dispatch(closeSearch())}
                                        className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl hover:border-primary transition-all group text-left"
                                    >
                                        <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-100 dark:border-white/5 shadow-sm">
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{cat.name}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                                            </span>
                                        </div>
                                    </Link>
                                    );
                                })}
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
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.id}`}
                                        onClick={() => handleProductClick(product.id)}
                                        className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                                    >
                                        <div className="size-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 dark:border-white/5">
                                            <img
                                                src={resolveImageUrl(product)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-1 block">
                                                {product.subcategory_name || product.category_name || 'Snack'}
                                            </span>
                                            <h4 className="text-base font-black text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">{product.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">₹{product.starting_from || product.price}</span>
                                                <span className="text-[10px] font-bold text-slate-400 line-through">₹{(Number(product.starting_from || product.price || 0) + 60).toFixed(0)}</span>
                                            </div>
                                        </div>
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={18} />
                                        </div>
                                    </Link>
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
