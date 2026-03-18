import React, { useEffect, useMemo } from 'react';
import { Heart, ShoppingBag, Trash2, RefreshCw, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import ProductCard from '../../components/common/ProductCard';
import Skeleton from '../../components/common/Skeleton';
import {
    clearWishlistError,
    selectWishlistCount,
    selectWishlistError,
    selectWishlistHasLoaded,
    selectWishlistItems,
    selectWishlistLoading,
} from '../../redux/slice/wishlistSlice';
import { clearWishlistItems, fetchWishlist } from '../../redux/thunk/wishlistThunk';

const Wishlist = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const wishlistItems = useSelector(selectWishlistItems);
    const wishlistCount = useSelector(selectWishlistCount);
    const loading = useSelector(selectWishlistLoading);
    const error = useSelector(selectWishlistError);
    const hasLoaded = useSelector(selectWishlistHasLoaded);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    const wishlistProducts = useMemo(
        () => wishlistItems.map((item) => ({
            wishlist_item_id: item.id,
            id: item.product_id,
            product_variant: item.product_variant,
            name: item.product_name,
            product_weight: item.product_weight,
            product_price: item.product_price,
            product_old_price: item.product_original_price,
            status: item.product_status,
            product_image: item.product_image,
            slug: item.product_slug,
            is_wishlisted: true,
        })),
        [wishlistItems]
    );

    const handleRefresh = () => {
        dispatch(clearWishlistError());
        dispatch(fetchWishlist({ force: true }));
    };

    const handleClearWishlist = async () => {
        try {
            await dispatch(clearWishlistItems()).unwrap();
            toast.success('Wishlist cleared', {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        } catch (clearError) {
            toast.error(clearError || 'Failed to clear wishlist', {
                style: {
                    borderRadius: '16px',
                    background: '#dc2626',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/70 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 shadow-inner">
                        <LogIn size={40} className="text-slate-300 dark:text-slate-600" />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Login to View Wishlist</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-xs mb-10 leading-relaxed uppercase tracking-[0.2em]">
                        Save your favorite products and access them anytime.
                    </p>

                    <Link
                        to="/login"
                        className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                    >
                        <LogIn size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (loading && !hasLoaded) {
        return (
            <div className="py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
                    <div>
                        <Skeleton variant="title" width="180px" height="32px" className="mb-1" />
                        <Skeleton variant="text" width="150px" />
                    </div>
                    <Skeleton variant="text" width="120px" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-25">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white/70 dark:bg-slate-900/40 border border-white dark:border-slate-800 rounded-3xl p-4 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <Skeleton variant="rectangular" width="100%" height="200px" className="rounded-2xl mb-4" />
                            <div className="space-y-3">
                                <Skeleton variant="title" width="80%" height="20px" />
                                <Skeleton variant="text" width="100px" />
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton variant="title" width="60px" height="24px" />
                                    <Skeleton variant="rectangular" width="40px" height="40px" className="rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-8 border border-red-100 dark:border-red-800 shadow-inner">
                        <Heart size={40} className="text-red-200 dark:text-red-500/40" />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Wishlist Error</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-sm mb-10 leading-relaxed">
                        {error}
                    </p>

                    <button
                        onClick={handleRefresh}
                        className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                    >
                        <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (wishlistProducts.length === 0) {
        return (
            <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-100 dark:border-red-500/20 shadow-inner">
                        <Heart size={40} className="text-red-200 dark:text-red-500/40" />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Your Wishlist is Empty</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-xs mb-10 leading-relaxed uppercase tracking-[0.2em]">
                        Seems like you haven't saved any of your favorites yet.
                    </p>

                    <Link
                        to="/shop"
                        className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                    >
                        <ShoppingBag size={16} className="group-hover:translate-y-[-2px] transition-transform" />
                        Go Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                        Your <span className="text-rose-500 italic">Wishlist</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleClearWishlist}
                    disabled={loading}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                    Clear All Favorites
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-25">
                {wishlistProducts.map((product) => (
                    <div key={product.wishlist_item_id} className="flex justify-center w-full">
                        <ProductCard product={product} variant="horizontal-mobile" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
