import React, { useEffect, useState } from 'react';
import { Heart, Star, Plus, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { addItem } from '../../redux/thunk/cartThunk';
import { showPopup } from '../../redux/slice/cartPopupSlice';
import { addItemToWishlist, fetchWishlist, removeItemFromWishlist } from '../../redux/thunk/wishlistThunk';
import { fetchProductById } from '../../api/product.api.js';

const ProductCard = ({ product, variant = "vertical" }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const wishlistPendingProductIds = useSelector((state) => state.wishlist.pendingProductIds);
    const wishlistHasLoaded = useSelector((state) => state.wishlist.hasLoaded);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Map API data to component safe names if they are slightly different
    const id = product.id ?? product.product_id;
    const name = product.name;
    const image = product.image || product.product_image || (product.images && product.images[0]?.productimages) || "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop";
    const price = product.price || product.product_price || product.starting_from;
    const oldPrice = product.oldPrice || product.product_old_price || null;
    const discount = oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
    const rating = product.rating || product.avg_rating || 5;
    const reviews = product.reviews || product.review_count || 0;
    const weight = product.weight || product.product_weight || "Standard Pack";
    const tag = product.status || (discount > 0 || !product.status ? `${discount || 0}% OFF` : null);
    const tagBg = product.status ? product.tagBg : 'bg-rose-500';
    const existingWishlistItem = wishlistItems.find((item) => item.product_id === id) ?? null;
    const isWishlisted = wishlistHasLoaded ? Boolean(existingWishlistItem) : Boolean(product.is_wishlisted);
    const isWishlistUpdating = wishlistPendingProductIds.includes(id);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    const resolveWishlistVariantId = async () => {
        if (existingWishlistItem?.product_variant) {
            return existingWishlistItem.product_variant;
        }

        let variantId = product.variant_id ?? product.product_variant ?? null;
        let variants = product.variants ?? [];

        if (!variantId && variants.length === 0) {
            const detailedProduct = await fetchProductById(id);
            variants = detailedProduct?.variants ?? [];
        }

        if (!variantId && variants.length > 0) {
            const activeVariant = variants.find((item) => item.is_active !== false) ?? variants[0];
            variantId = activeVariant?.id ?? null;
        }

        if (!variantId) {
            throw new Error('Product variant not found');
        }

        return variantId;
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to manage wishlist', {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
            navigate('/login');
            return;
        }

        try {
            if (isWishlisted && existingWishlistItem?.product_variant) {
                await dispatch(removeItemFromWishlist({
                    variantId: existingWishlistItem.product_variant,
                    productId: id,
                })).unwrap();

                toast.success(`${name} removed from favorites`, {
                    style: {
                        borderRadius: '16px',
                        background: '#0f172a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    },
                });
                return;
            }

            const variantId = await resolveWishlistVariantId();
            await dispatch(addItemToWishlist({ variantId, productId: id })).unwrap();

            toast.success(`${name} saved to favorites!`, {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        } catch (error) {
            toast.error(error || 'Failed to update wishlist', {
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

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to add items to cart', {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
            navigate('/login');
            return;
        }

        setIsAddingToCart(true);
        try {
            let variantId = product.variant_id ?? product.product_variant ?? null;
            let variantStock = product.stock ?? null;
            let variants = product.variants ?? [];

            if (!variantId && variants.length === 0) {
                const detailedProduct = await fetchProductById(id);
                variants = detailedProduct?.variants ?? [];
            }

            if (!variantId && variants.length > 1) {
                navigate(`/product/${id}`);
                return;
            }

            if (!variantId && variants.length === 1) {
                variantId = variants[0].id;
                variantStock = variants[0].stock ?? null;
            }

            if (!variantId) {
                throw new Error('Product variant not found');
            }

            if (variantStock !== null && variantStock < 1) {
                throw new Error('This product is out of stock');
            }

            await dispatch(addItem({ variantId, quantity: 1 })).unwrap();

            dispatch(showPopup({
                name,
                image,
                price,
                weight
            }));
        } catch (error) {
            const errorMessage = error?.detail || error?.message || 'Failed to add to cart';

            if (errorMessage.includes('No ProductVariant matches') || errorMessage.includes('Not Found')) {
                toast.error('This product variant is no longer available', {
                    style: {
                        borderRadius: '16px',
                        background: '#dc2626',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    },
                });
            } else {
                toast.error(errorMessage, {
                    style: {
                        borderRadius: '16px',
                        background: '#dc2626',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    },
                });
            }
        } finally {
            setIsAddingToCart(false);
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
        <Link
            to={`/product/${id}`}
            className={`group relative flex transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-3xl ${theme.hoverShadow} ${isHorizontalMobile
                ? "flex-row w-full p-3 md:flex-col md:p-5"
                : "flex-col min-w-[260px] w-[260px] p-4 md:p-5"}`}
        >

            {/* Image Section */}
            <div className={`relative shrink-0 ${isHorizontalMobile
                ? "w-28 h-28 md:w-full md:aspect-square md:h-auto"
                : "w-full aspect-square mb-4 md:mb-5"}`}>
                <div className="w-full h-full min-h-32 bg-slate-50 dark:bg-slate-800/40 relative overflow-hidden rounded-xl sm:rounded-2xl">
                    <img
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={image}
                        loading="lazy"
                    />

                    {/* Status Overlay / Loading State */}
                    <div className="absolute sm:top-3 top-1 sm:left-3 left-2 flex items-start pointer-events-none z-10 transition-all duration-300">
                        {isAddingToCart ? (
                            <div className="flex items-center gap-2 bg-primary/90 backdrop-blur-md text-white font-black uppercase tracking-[0.15em] rounded-lg shadow-lg border border-white/20 text-[7px] md:text-[8px] px-2.5 py-1.5 animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                                Processing
                            </div>
                        ) : tag && (
                            <span className={`${tagBg || 'bg-slate-900/80'} backdrop-blur-md text-white font-black uppercase tracking-wider rounded-lg shadow-sm border border-white/10 text-[8px] md:text-[9px] px-2 py-1`}>
                                {tag}
                            </span>
                        )}
                    </div>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    aria-label="Add to Wishlist"
                    disabled={isWishlistUpdating}
                    className={`absolute rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-lg z-20 border border-white dark:border-white/5 group/heart ${isHorizontalMobile
                        ? "sm:-bottom-1 -bottom-2 right-2 sm:-right-1 md:bottom-0 md:right-2 md:translate-y-1/2 w-8 h-8 md:w-9 md:h-9"
                        : "bottom-0 right-2 translate-y-1/2 w-9 h-9"} ${isWishlisted ? "text-rose-500" : ""} ${isWishlistUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
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
                    <p className="text-slate-400 dark:text-slate-500 font-black tracking-[0.15em] text-[9px] md:text-[10px] mb-4 md:mb-6">
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
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className={`group/btn cursor-pointer flex items-center gap-2 ${theme.btnBase} text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all ${theme.btnHover} active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isAddingToCart ? (
                            <div className="flex items-center gap-2">
                                <div className="relative w-4 h-4">
                                    <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <span className="animate-pulse">Adding</span>
                            </div>
                        ) : (
                            <>
                                Add
                                <Plus size={16} className="transition-transform group-hover/btn:rotate-90 duration-300" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
