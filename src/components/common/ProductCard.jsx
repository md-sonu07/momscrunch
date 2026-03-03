import React, { useState } from 'react';
import { Heart, Star, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, variant = "vertical" }) => {
    const { showToast } = useToast();
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted || false);

    // Map API data to component safe names if they are slightly different
    const name = product.name;
    const image = product.image || (product.images && product.images[0]?.productimages) || "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop";
    const price = product.price || product.starting_from;
    const oldPrice = product.oldPrice;
    const rating = product.rating || product.avg_rating || 5;
    const reviews = product.reviews || product.review_count || 0;
    const weight = product.weight || "Standard Pack";
    const tag = product.tag;
    const tagBg = product.tagBg;

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        if (!isWishlisted) {
            toast.success(`${name} saved to favorites!`, {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        }
    };
    // Dynamic theme mapping for UI accents
    const themes = {
        emerald: {
            hoverShadow: "hover:shadow-emerald-500/10",
            btnHover: "hover:bg-emerald-600 hover:shadow-emerald-500/20",
            btnBase: "bg-emerald-500",
            hoverText: "group-hover:text-emerald-500",
            iconColor: "text-emerald-500"
        },
        orange: {
            hoverShadow: "hover:shadow-orange-500/10",
            btnHover: "hover:bg-orange-600 hover:shadow-orange-500/20",
            btnBase: "bg-orange-500",
            hoverText: "group-hover:text-orange-500",
            iconColor: "text-orange-500"
        },
        amber: {
            hoverShadow: "hover:shadow-amber-500/10",
            btnHover: "hover:bg-amber-600 hover:shadow-amber-500/20",
            btnBase: "bg-amber-500",
            hoverText: "group-hover:text-amber-500",
            iconColor: "text-amber-500"
        },
        rose: {
            hoverShadow: "hover:shadow-rose-500/10",
            btnHover: "hover:bg-rose-600 hover:shadow-rose-500/20",
            btnBase: "bg-rose-500",
            hoverText: "group-hover:text-rose-500",
            iconColor: "text-rose-500"
        }
    };

    const theme = themes[product.themeColor] || themes.orange;
    const isHorizontalMobile = variant === "horizontal-mobile";

    return (
        <div className={`group relative flex transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-3xl ${theme.hoverShadow} ${isHorizontalMobile
            ? "flex-row w-full p-3 md:flex-col md:p-5"
            : "flex-col min-w-[260px] w-[260px] p-4 md:p-5"}`}>

            {/* Image Section */}
            <div className={`relative shrink-0 ${isHorizontalMobile
                ? "w-28 h-28 md:w-full md:aspect-square md:h-auto"
                : "w-full aspect-square mb-4 md:mb-5"}`}>
                <div className="w-full h-full bg-slate-50 dark:bg-slate-800/40 relative overflow-hidden rounded-2xl">
                    <img
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={image}
                        loading="lazy"
                    />

                    {/* Status Overlay */}
                    {tag && (
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none z-10">
                            <span className={`${tagBg || 'bg-slate-900/80'} backdrop-blur-md text-white font-black uppercase tracking-wider rounded-lg shadow-sm border border-white/10 text-[8px] md:text-[9px] px-2 py-1`}>
                                {tag}
                            </span>
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    aria-label="Add to Wishlist"
                    className={`absolute rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-lg z-20 border border-white dark:border-white/5 group/heart ${isHorizontalMobile
                        ? "-bottom-1 -right-1 md:bottom-0 md:right-2 md:translate-y-1/2 w-8 h-8 md:w-9 md:h-9"
                        : "bottom-0 right-2 translate-y-1/2 w-9 h-9"} ${isWishlisted ? "text-rose-500" : ""}`}
                >
                    <Heart size={isHorizontalMobile ? 18 : 20} className={`transition-transform ${isWishlisted ? "fill-current" : "group-hover/heart:fill-current"}`} />
                </button>
            </div>

            {/* Content Section */}
            <div className={`flex flex-col flex-1 ${isHorizontalMobile ? "ml-4 md:ml-0 md:mt-1" : "px-0.5"}`}>
                <div className="flex-1">
                    <h4 className={`font-black text-slate-900 dark:text-white mb-1.5 ${theme.hoverText} transition-colors line-clamp-2 text-sm md:text-base leading-tight`}>
                        {name}
                    </h4>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={10}
                                className={`${i < Math.floor(rating) ? 'fill-current' : 'text-slate-200 dark:text-slate-800'}`}
                            />
                        ))}
                        <span className="text-[9px] font-black text-slate-400 ml-1.5">
                            ({reviews})
                        </span>
                    </div>

                    {/* Meta Info */}
                    <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em] text-[9px] md:text-[10px] mb-4 md:mb-6">
                        {weight}
                    </p>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-white/5">
                    <div className="flex flex-col leading-none">
                        {oldPrice && (
                            <span className="font-bold text-slate-400 dark:text-slate-600 line-through text-[10px] mb-1">
                                ₹{oldPrice}
                            </span>
                        )}
                        <span className="font-black text-slate-900 dark:text-white text-lg md:text-xl">
                            ₹{price}
                        </span>
                    </div>

                    <button
                        onClick={() => showToast(name)}
                        className={`group/btn cursor-pointer flex items-center gap-2 ${theme.btnBase} text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${theme.btnHover} active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none hover:-translate-y-0.5`}
                    >
                        Add
                        <Plus size={16} className="transition-transform group-hover/btn:rotate-90 duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
