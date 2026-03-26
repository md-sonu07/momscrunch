import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductBySlug } from '../../redux/thunk/productThunk';
import { addItem } from '../../redux/thunk/cartThunk';
import { showPopup } from '../../redux/slice/cartPopupSlice';
import { getStoreSettings } from '../../redux/thunk/storeSettingsThunk';
import { addItemToWishlist, fetchWishlist, removeItemFromWishlist } from '../../redux/thunk/wishlistThunk';
import { fetchProducts } from '../../api/product.api.js';
import { getShippingCharges } from '../../api/shipping.api';
import ProductCard from '../../components/common/ProductCard';
import Skeleton from '../../components/common/Skeleton';
import {
    Star,
    Minus,
    Plus,
    ShoppingCart,
    Zap,
    ShieldCheck,
    Truck,
    RefreshCcw,
    Heart,
    ChevronRight,
    ShoppingBag,
    Home as HomeIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductReviews from '../../components/userComponents/product/ProductReviews';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.product);
    const { deliveryCharge, loading: storeSettingsLoading } = useSelector((state) => state.storeSettings);
    const currentLocation = useSelector((state) => state.location.currentLocation);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const wishlistPendingProductIds = useSelector((state) => state.wishlist.pendingProductIds);
    const wishlistHasLoaded = useSelector((state) => state.wishlist.hasLoaded);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [otherProducts, setOtherProducts] = useState([]);
    const [dynamicShippingCharge, setDynamicShippingCharge] = useState(0);
    const [isFetchingShipping, setIsFetchingShipping] = useState(false);

    useEffect(() => {
        dispatch(getProductBySlug(slug));
        dispatch(getStoreSettings()).catch(() => { });
        window.scrollTo(0, 0);
    }, [dispatch, slug]);

    // Fetch shipping charges based on navbar pincode and product price
    useEffect(() => {
        const fetchShippingCharges = async () => {
            if (!currentLocation.pincode || !product) {
                setDynamicShippingCharge(0);
                return;
            }

            setIsFetchingShipping(true);
            
            try {
                const response = await getShippingCharges({
                    pincode: currentLocation.pincode,
                    cart_total: product.discounted_price || product.price
                });
                
                setDynamicShippingCharge(response.shipping_charges || 0);
            } catch (error) {
                console.error('Error fetching shipping charges:', error);
                setDynamicShippingCharge(0);
            } finally {
                setIsFetchingShipping(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchShippingCharges();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [currentLocation.pincode, product]);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(0);
        }
        if (product?.variants?.length > 0) {
            setSelectedVariant(product.variants[0]);
        }

        if (product) {
            const fetchExtraProducts = async () => {
                try {
                    // Fetch Related Products (same category)
                    if (product.category) {
                        const relatedData = await fetchProducts({ category: product.category });
                        const relatedResults = relatedData.results || relatedData.data || relatedData;
                        if (Array.isArray(relatedResults)) {
                            setRelatedProducts(relatedResults.filter(p => p.id !== product.id).slice(0, 4));
                        }
                    }

                    // Fetch Other Products (to show variety)
                    const otherData = await fetchProducts();
                    const otherResults = otherData.results || otherData.data || otherData;
                    if (Array.isArray(otherResults)) {
                        setOtherProducts(
                            otherResults
                                .filter(p => p.id !== product.id && p.category !== product.category)
                                .slice(0, 4)
                        );
                    }
                } catch (err) {
                    console.error("Failed to fetch extra products:", err);
                }
            };
            fetchExtraProducts();
        }
    }, [product]);

    const handleQuantityChange = (type) => {
        if (type === 'plus') {
            if (selectedVariant?.stock && quantity >= selectedVariant.stock) {
                return;
            }
            setQuantity(prev => prev + 1);
        } else if (type === 'minus' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const addSelectedVariantToCart = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            navigate('/login');
            return false;
        }

        if (!selectedVariant) {
            toast.error("Please select a variant first");
            return false;
        }

        if (selectedVariant.stock < quantity) {
            toast.error("Requested quantity is not available");
            return false;
        }

        await dispatch(addItem({ variantId: selectedVariant.id, quantity })).unwrap();
        return true;
    };

    const handleAddToCart = async () => {
        try {
            const added = await addSelectedVariantToCart();

            if (!added) {
                return;
            }

            dispatch(showPopup({
                name: product.name,
                image: images[selectedImage],
                price: price,
                weight: selectedVariant.weight
            }));
        } catch (error) {
            toast.error(error || 'Failed to add item to cart');
        }
    };

    const handleBuyNow = async () => {
        try {
            const added = await addSelectedVariantToCart();

            if (!added) {
                return;
            }

            navigate('/checkout');
        } catch (error) {
            toast.error(error || 'Failed to add item to cart');
        }
    };

    if (loading || (!product && !error)) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20">
                {/* Breadcrumbs Skeleton */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                    <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                        <div className="flex items-center gap-1">
                            <HomeIcon size={14} className="text-slate-300 dark:text-slate-700" />
                            <Skeleton variant="text" width="40px" />
                        </div>
                        <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
                        <Skeleton variant="text" width="40px" />
                        <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
                        <Skeleton variant="text" width="120px" />
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
                        {/* Left: Images Skeleton */}
                        <div className="space-y-6">
                            <Skeleton variant="rectangular" className="h-[300px] md:h-[400px] lg:h-[470px] w-full rounded-3xl" />
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                <Skeleton variant="rectangular" className="w-24 h-24 rounded-2xl shrink-0" />
                                <Skeleton variant="rectangular" className="w-24 h-24 rounded-2xl shrink-0" />
                                <Skeleton variant="rectangular" className="w-24 h-24 rounded-2xl shrink-0" />
                            </div>
                        </div>

                        {/* Right: Content Skeleton */}
                        <div className="space-y-8">
                            <div>
                                <Skeleton variant="text" className="w-32 mb-4" />
                                <Skeleton variant="title" className="w-4/5 h-10 md:h-12 mb-4" />
                                <div className="flex gap-4">
                                    <Skeleton variant="rectangular" className="w-24 h-8 rounded-xl" />
                                    <Skeleton variant="text" className="w-40" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Skeleton variant="title" className="w-2/5" />
                                <Skeleton variant="text" className="w-full" />
                                <Skeleton variant="text" className="w-full" />
                                <Skeleton variant="text" className="w-3/5" />
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-4xl border border-slate-100 dark:border-white/5 space-y-6">
                                <div className="space-y-2">
                                    <Skeleton variant="title" className="w-24 h-9" />
                                    <Skeleton variant="text" className="w-40" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton variant="text" className="w-24" />
                                    <div className="flex gap-2">
                                        <Skeleton variant="circular" className="w-12 h-12" />
                                        <Skeleton variant="circular" className="w-12 h-12" />
                                        <Skeleton variant="circular" className="w-12 h-12" />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton variant="rectangular" className="w-32 h-12 rounded-xl" />
                                    <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
                                </div>
                            </div>
                            <Skeleton variant="rectangular" className="w-full h-14 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background-light dark:bg-background-dark font-sans">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 max-w-lg w-full">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="text-primary" size={40} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white uppercase tracking-tight">Product Not Found</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-bold text-sm">The premium crunch you're looking for might have been eaten or moved to another shelf!</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="cursor-pointer w-full bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all active:scale-95"
                    >
                        Explore Other Snacks
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer w-full mt-4 text-slate-400 hover:text-primary font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const price = selectedVariant
        ? (selectedVariant.discount_price ? selectedVariant.discount_price : selectedVariant.price)
        : (product.discount_price || product.price || product.starting_from);
    const oldPrice = selectedVariant
        ? (selectedVariant.discount_price ? selectedVariant.price : null)
        : (product.discount_price && product.starting_from ? product.starting_from : (product.oldPrice || null));
    const discount = oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
    const images = product.images?.length > 0
        ? product.images.map(img => img.productimages)
        : [product.image || "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop"];
    const productId = product.id;
    const existingWishlistItem = wishlistItems.find((item) => item.product_id === productId) ?? null;
    const isWishlisted = wishlistHasLoaded ? Boolean(existingWishlistItem) : Boolean(product.is_wishlisted);
    const isWishlistUpdating = wishlistPendingProductIds.includes(productId);

    const handleWishlist = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to manage wishlist');
            navigate('/login');
            return;
        }

        try {
            if (isWishlisted && existingWishlistItem?.product_variant) {
                await dispatch(removeItemFromWishlist({
                    variantId: existingWishlistItem.product_variant,
                    productId,
                })).unwrap();

                toast.success('Removed from your favorites!', {
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

            if (!selectedVariant) {
                toast.error('Please select a variant first');
                return;
            }

            await dispatch(addItemToWishlist({
                variantId: selectedVariant.id,
                productId,
            })).unwrap();

            toast.success('Saved to your favorites!', {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        } catch (error) {
            toast.error(error || 'Failed to update wishlist');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                    <HomeIcon size={14} />
                    <button onClick={() => navigate('/')} className="cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
                        Home
                    </button>
                    <ChevronRight size={12} />
                    <button onClick={() => navigate('/shop')} className="cursor-pointer hover:text-primary transition-colors">
                        Shop
                    </button>
                    <ChevronRight size={12} />
                    <span className="text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-none">
                        {product.name}
                    </span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                    {/* Left Column: Images */}
                    <div className="space-y-6">
                        <div className="relative h-[300px] md:h-[400px] lg:h-[470px] rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-700 ease-out hover:scale-105"
                            />

                            <button
                                onClick={handleWishlist}
                                disabled={isWishlistUpdating}
                                className={`cursor-pointer absolute top-6 right-6 z-10 w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center transition-all shadow-xl group border border-white dark:border-white/5 ${isWishlisted ? 'text-rose-500' : 'text-slate-700 hover:text-rose-500'} ${isWishlistUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <Heart size={20} className={isWishlisted ? "fill-current" : "group-hover:fill-current"} />
                            </button>
                        </div>

                        {/* Thumbnail Grid */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`cursor-pointer relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx
                                            ? 'border-primary shadow-lg shadow-primary/20 scale-95'
                                            : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-[1.5px] w-8 bg-primary"></div>
                                <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                                    {product.category_name || 'Premium Collection'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                                    {product.name}
                                </h1>
                                {(() => {
                                    const displayStatus = product.status || (discount > 0 ? `${discount}% OFF` : (oldPrice && price === oldPrice ? "No Discount" : null));
                                    return displayStatus && (
                                        <span className="bg-orange-500 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg shadow-orange-500/20">
                                            {displayStatus}
                                        </span>
                                    );
                                })()}
                            </div>

                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/5 px-3 py-1.5 rounded-xl border border-amber-400/10">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < Math.floor(product.avg_rating || 5) ? 'fill-current' : 'text-slate-200 dark:text-slate-800'}
                                        />
                                    ))}
                                    <span className="text-xs font-black ml-1 text-amber-600 dark:text-amber-400">
                                        {product.avg_rating || 5.0}
                                    </span>
                                </div>
                                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {product.review_count || 0} Verified Reviews
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-widest">
                                Product Description
                            </h3>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {product.description || "Experience the authentic taste of tradition. Our products are made with the finest ingredients, following century-old recipes passed down through generations. No artificial preservatives, just the pure love of home-cooked goodness."}
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 mb-6">
                            {/* Price */}
                            <div className="flex items-end gap-3 mb-6">
                                <div className="flex gap-2">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                                        ₹{price}
                                    </span>
                                    {oldPrice && (
                                        <span className="text-lg mt-2 font-bold text-slate-400 line-through leading-none">
                                            ₹{oldPrice}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 pb-1">
                                    {isFetchingShipping ? (
                                        <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">Checking shipping...</span>
                                    ) : !currentLocation.pincode ? (
                                        <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">Select pincode for shipping</span>
                                    ) : dynamicShippingCharge > 0 ? (
                                        <span className="text-slate-600 dark:text-slate-400 font-bold text-xs">+ ₹{dynamicShippingCharge} Shipping</span>
                                    ) : (
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">Free Shipping</span>
                                    )}
                                </div>
                            </div>

                            {/* Options / Weight */}
                            <div className="mb-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 px-1">Available Weight</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants?.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`cursor-pointer px-5 py-3 rounded-full text-xs font-black lowercase tracking-widest transition-all ${selectedVariant?.id === v.id
                                                ? 'bg-orange-500 text-white shadow-lg shadow-primary/20'
                                                : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {v.weight}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-stretch gap-4">
                                <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-white/5 shrink-0">
                                    <button
                                        onClick={() => handleQuantityChange('minus')}
                                        className="cursor-pointer w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors active:scale-95"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-black text-slate-900 dark:text-white text-sm">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange('plus')}
                                        className="cursor-pointer w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors active:scale-95"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="cursor-pointer text-nowrap flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:scale-[0.98] shadow-xl shadow-slate-900/10 dark:shadow-none"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        <button
                            onClick={handleBuyNow}
                            className="cursor-pointer w-full bg-primary text-white py-4 px-8 rounded-xl font-black uppercase tracking-[0.25em] text-xs md:text-sm flex items-center justify-center gap-4 transition-all hover:shadow-[0_20px_40px_rgba(236,109,19,0.3)] hover:scale-[1.01] active:scale-[0.99] mb-8 group"
                        >
                            <Zap size={20} className="fill-current group-hover:animate-pulse" />
                            Buy Now
                        </button>

                        {/* Product Features */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { icon: ShieldCheck, label: '100% Homemade', color: 'text-emerald-500' },
                                { icon: Truck, label: 'Fast Delivery', color: 'text-blue-500' },
                                { icon: RefreshCcw, label: 'Quality Assured', color: 'text-amber-500' },
                                { icon: Star, label: 'Mom\'s Recipe', color: 'text-rose-500' },
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30">
                                    <feature.icon size={20} className={feature.color} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                                        {feature.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-slate-100 dark:border-white/5 mt-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Related Products
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-bold">
                                Because you loved {product.name}
                            </p>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => navigate('/shop')}
                            className="cursor-pointer text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            View All <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Other Products Section */}
            {otherProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24">
                    <div className="mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                More to Explore
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-bold">
                                Discover other favorites from Mom's Kitchen
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {otherProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => navigate('/shop')}
                            className="cursor-pointer text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            Shop All <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}



            {/* Review System */}
            <ProductReviews productName={product.name} productId={product.id} />
        </div>
    );
};

export default ProductDetail;
