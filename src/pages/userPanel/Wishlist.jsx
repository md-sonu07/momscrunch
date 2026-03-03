import React, { useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProductCard from '../../components/common/ProductCard';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: "Rajasthani Garlic Achar",
            image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop",
            tag: "Top Rated",
            rating: 4,
            reviews: 94,
            weight: "250g Glass Jar",
            price: 149,
            oldPrice: 175,
            themeColor: "emerald"
        },
        {
            id: 2,
            name: "Peri Peri Roasted Makhana",
            image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=800&auto=format&fit=crop",
            tag: "Best Seller",
            rating: 5,
            reviews: 210,
            weight: "150g Pouch",
            price: 199,
            oldPrice: 249,
            themeColor: "amber"
        }
    ]);

    const clearWishlist = () => {
        setWishlistItems([]);
        toast.success("Wishlist cleared", {
            style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
        });
    };

    if (wishlistItems.length === 0) {
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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                        Your <span className="text-rose-500 italic">Wishlist</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                        </p>
                    </div>
                </div>

                <button
                    onClick={clearWishlist}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors cursor-pointer group"
                >
                    <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                    Clear All Favorites
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-25">
                {wishlistItems.map((product) => (
                    <div key={product.id} className="flex justify-center w-full">
                        <ProductCard product={product} variant="horizontal-mobile" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
