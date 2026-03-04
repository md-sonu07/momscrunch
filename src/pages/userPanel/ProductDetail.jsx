import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../../redux/thunk/productThunk';
import { addItem } from '../../redux/thunk/cartThunk';
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
    Home as HomeIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.product);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        dispatch(getProductById(id));
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(0);
        }
    }, [product]);

    const handleQuantityChange = (type) => {
        if (type === 'plus') {
            setQuantity(prev => prev + 1);
        } else if (type === 'minus' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        dispatch(addItem({ productId: id, quantity }));
        toast.success(`${product.name} added to cart!`, {
            style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
        });
    };

    const handleBuyNow = () => {
        dispatch(addItem({ productId: id, quantity }));
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-primary text-white px-6 py-2 rounded-full font-bold"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    const price = product.price || product.starting_from;
    const oldPrice = product.oldPrice;
    const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
    const images = product.images?.length > 0
        ? product.images.map(img => img.productimages)
        : [product.image || "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop"];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                    <button onClick={() => navigate('/')} className="hover:text-primary transition-colors flex items-center gap-1">
                        <HomeIcon size={14} /> Home
                    </button>
                    <ChevronRight size={12} />
                    <button onClick={() => navigate('/shop')} className="hover:text-primary transition-colors">
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
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-700 ease-out hover:scale-105"
                            />
                            {discount > 0 && (
                                <div className="absolute top-6 left-6 z-10">
                                    <span className="bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg shadow-rose-500/20">
                                        {discount}% OFF
                                    </span>
                                </div>
                            )}
                            <button className="absolute top-6 right-6 z-10 w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-xl group border border-white dark:border-white/5">
                                <Heart size={20} className="group-hover:fill-current" />
                            </button>
                        </div>

                        {/* Thumbnail Grid */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx
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
                                    {product.category || 'Premium Collection'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 tracking-tight">
                                {product.name}
                            </h1>

                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/5 px-3 py-1.5 rounded-xl border border-amber-400/10">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-slate-200 dark:text-slate-800'}
                                        />
                                    ))}
                                    <span className="text-xs font-black ml-1 text-amber-600 dark:text-amber-400">
                                        {product.rating || 5.0}
                                    </span>
                                </div>
                                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {product.reviews || 0} Verified Reviews
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 mb-8">
                            {/* Price */}
                            <div className="flex items-end gap-4 mb-8">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">
                                    ₹{price}
                                </span>
                                {oldPrice && (
                                    <span className="text-xl font-bold text-slate-400 line-through mb-1">
                                        ₹{oldPrice}
                                    </span>
                                )}
                            </div>

                            {/* Options / Weight */}
                            <div className="mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 px-1">Available Weight</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['250g', '500g', '1kg'].map(w => (
                                        <button
                                            key={w}
                                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${product.weight?.includes(w) || (w === '250g' && !product.weight)
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {w}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-100 dark:border-white/5 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleQuantityChange('minus')}
                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors active:scale-95"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-black text-slate-900 dark:text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange('plus')}
                                        className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors active:scale-95"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4.5 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:scale-[0.98] shadow-2xl shadow-slate-900/20 dark:shadow-none"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        <button
                            onClick={handleBuyNow}
                            className="w-full bg-primary text-white py-5 px-8 rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-xs md:text-sm flex items-center justify-center gap-4 transition-all hover:shadow-[0_20px_40px_rgba(236,109,19,0.3)] hover:scale-[1.01] active:scale-[0.99] mb-10 group"
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

                        {/* Description */}
                        <div className="border-t border-slate-100 dark:border-white/5 pt-10">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                                Product Description
                            </h3>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {product.description || "Experience the authentic taste of tradition. Our products are made with the finest ingredients, following century-old recipes passed down through generations. No artificial preservatives, just the pure love of home-cooked goodness."}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
