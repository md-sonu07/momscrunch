import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft, CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { fetchCart, updateQuantity, deleteItem } from '../../redux/thunk/cartThunk';
import { selectCart, selectCartItems, selectCartLoading, selectCartError, clearCartError } from '../../redux/slice/cartSlice';
import { getStoreSettings } from '../../redux/thunk/storeSettingsThunk';
import { calculateOrderSummary, formatCurrency } from '../../utils/orderSummary';
import Skeleton from '../../components/common/Skeleton';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(selectCart);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const cartItems = useSelector(selectCartItems);
    const {
        gstPercentage,
        deliveryCharge,
        freeShippingThreshold,
        loading: storeSettingsLoading,
    } = useSelector((state) => state.storeSettings);

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(getStoreSettings()).catch(() => { });
    }, [dispatch]);

    const handleRefreshCart = () => {
        dispatch(clearCartError());
        dispatch(fetchCart());
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await dispatch(updateQuantity({ itemId, quantity: newQuantity })).unwrap();
        } catch (error) {
            toast.error(error || 'Failed to update quantity', {
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

    const handleRemoveItem = async (itemId, name) => {
        try {
            await dispatch(deleteItem(itemId)).unwrap();
            toast.success(`${name} removed from bag`, {
                style: {
                    borderRadius: '16px',
                    background: '#0f172a',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px'
                },
            });
        } catch (error) {
            toast.error(error || 'Failed to remove item', {
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

    const { subtotal, originalSubtotal, totalDiscount } = useMemo(() => {
        const selling = cartItems.reduce((acc, item) => acc + (parseFloat(item.product_price) * item.quantity), 0);
        const original = cartItems.reduce((acc, item) => acc + (parseFloat(item.product_original_price || item.product_price) * item.quantity), 0);
        const discount = original - selling;
        return { subtotal: selling, originalSubtotal: original, totalDiscount: discount };
    }, [cartItems]);
    const summary = useMemo(
        () => calculateOrderSummary({
            subtotal,
            gstPercentage,
            deliveryCharge,
            freeShippingThreshold,
        }),
        [subtotal, gstPercentage, deliveryCharge, freeShippingThreshold]
    );

    // Error state
    if (error && !loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-8 border border-red-100 dark:border-red-800 shadow-xl">
                    <ShoppingBag size={40} className="text-red-300 dark:text-red-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Cart Error</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-md mb-8 leading-relaxed">
                    {error}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleRefreshCart}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                    <Link to="/shop" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:scale-105 active:scale-95 transition-all">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark pt-10 pb-24">
                <div className="max-w-[1600px] mx-auto pb-10">
                    <div className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
                        <Skeleton variant="title" width="220px" height="32px" className="mb-2" />
                        <Skeleton variant="text" width="150px" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-3 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/70 dark:bg-slate-900/40 border border-white dark:border-slate-800 rounded-xl p-3 flex gap-5 items-center">
                                    <Skeleton variant="rectangular" width="120px" height="120px" className="rounded-2xl" />
                                    <div className="flex-1 space-y-3">
                                        <div className="space-y-1">
                                            <Skeleton variant="text" width="60px" />
                                            <Skeleton variant="title" width="200px" height="20px" />
                                            <Skeleton variant="text" width="100px" />
                                        </div>
                                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50" />
                                        <div className="flex justify-between items-center">
                                            <Skeleton variant="rectangular" width="80px" height="32px" className="rounded-lg" />
                                            <Skeleton variant="title" width="100px" height="24px" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-white/70 dark:bg-slate-900/40 border border-white dark:border-slate-800 rounded-2xl p-8 sticky top-32">
                                <Skeleton variant="title" width="150px" height="24px" className="mb-8" />
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between">
                                        <Skeleton variant="text" width="80px" />
                                        <Skeleton variant="text" width="60px" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton variant="text" width="80px" />
                                        <Skeleton variant="text" width="60px" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton variant="text" width="80px" />
                                        <Skeleton variant="text" width="60px" />
                                    </div>
                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                        <Skeleton variant="text" width="100px" />
                                        <Skeleton variant="title" width="120px" height="32px" />
                                    </div>
                                </div>
                                <Skeleton variant="rectangular" width="100%" height="56px" className="rounded-xl mb-6" />
                                <Skeleton variant="text" width="120px" className="mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/60 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 shadow-xl">
                    <ShoppingBag size={40} className="text-slate-300 dark:text-slate-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Your cart is feeling light</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-xs mb-10 leading-relaxed uppercase tracking-widest">
                    Looks like you haven't added any crunch to your bag yet.
                </p>
                <Link to="/shop" className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
            <div className="max-w-[1600px] mx-auto pb-10">
                {/* Compact Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                            Shopping <span className="text-primary italic">Bag</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bucket
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {summary.freeShippingEligible && (
                            <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-500/80 px-4 py-2 rounded-xl border border-green-500/20 text-[10px] font-black uppercase tracking-widest w-fit">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                Free Shipping Eligible
                            </div>
                        )}
                        <button
                            onClick={handleRefreshCart}
                            disabled={loading}
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-3 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-xl p-3 shadow-xl shadow-slate-200/50 dark:shadow-none grid grid-cols-[120px_1fr] gap-x-5 items-center relative group transition-all hover:border-primary/20">
                                {/* Left side: Image */}
                                <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner overflow-hidden">
                                    <img
                                        src={item.product_image || 'https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop'}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Right side: Details & Controls */}
                                <div className="flex flex-col justify-between py-0.5">
                                    {/* Top Section: Category, Name & Price */}
                                    <div className="pr-10">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">{item.weight}</div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">
                                            {item.product_name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="text-[11px] font-black text-primary uppercase tracking-widest">₹{item.product_price}</div>
                                            {parseFloat(item.product_original_price) > parseFloat(item.product_price) && (
                                                <div className="text-[10px] font-bold text-slate-400 line-through opacity-60">₹{item.product_original_price}</div>
                                            )}
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ unit</div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50 my-2" />

                                    {/* Bottom Section: Quantity & Total */}
                                    <div className="flex items-center justify-between">
                                        {/* Compact Quantity Toggle */}
                                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-100 dark:border-slate-700">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors active:scale-90"
                                            >
                                                <Minus size={12} />
                                            </button>

                                            <span className="w-7 text-center text-[13px] font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors active:scale-90"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">₹{parseFloat(item.product_price) * item.quantity}</div>
                                    </div>
                                </div>

                                {/* Floating Remove Button */}
                                <button
                                    onClick={() => handleRemoveItem(item.id, item.product_name)}
                                    className="absolute top-4 right-4 p-1.5 text-red-500/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Remove Item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Link to="/shop" className="inline-flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest group">
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Simple Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-32">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                    <span className="uppercase tracking-widest text-[10px]">Subtotal (Original)</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{formatCurrency(originalSubtotal)}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between items-center text-sm font-bold text-emerald-500">
                                        <span className="uppercase tracking-widest text-[10px]">Product Discount</span>
                                        <span className="tabular-nums">-₹{formatCurrency(totalDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                    <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                                    {storeSettingsLoading ? (
                                        <span className="text-slate-900 dark:text-white tabular-nums">...</span>
                                    ) : summary.shipping === 0 ? (
                                        <span className="text-green-500 uppercase tracking-widest text-[10px] font-black underline underline-offset-4 decoration-2">Free</span>
                                    ) : (
                                        <span className="text-slate-900 dark:text-white tabular-nums">₹{formatCurrency(summary.shipping)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                    <span className="uppercase tracking-widest text-[10px]">Tax (GST {formatCurrency(gstPercentage)}%)</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{formatCurrency(summary.tax)}</span>
                                </div>
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-2">
                                    <span className="text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] text-xs">Total Amount</span>
                                    <span className="text-3xl font-black text-primary tabular-nums">₹{formatCurrency(summary.total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mb-2 cursor-pointer"
                            >
                                Checkout Now
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">
                                <CreditCard size={12} />
                                Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Cart;
