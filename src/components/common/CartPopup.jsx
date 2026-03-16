import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { hidePopup } from '../../redux/slice/cartPopupSlice';
import { selectCartItemCount } from '../../redux/slice/cartSlice';

const CartPopup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isOpen, addedProduct } = useSelector((state) => state.cartPopup);
    const cartItemCount = useSelector(selectCartItemCount);

    if (!isOpen || location.pathname.startsWith('/profile')) return null;

    const handleClose = () => {
        dispatch(hidePopup());
    };

    const handleViewCart = () => {
        dispatch(hidePopup());
        navigate('/profile/cart');
    };

    const handleCheckout = () => {
        dispatch(hidePopup());
        navigate('/checkout');
    };

    return (
        <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-100 w-[calc(100%-32px)] md:w-full md:max-w-[340px] pointer-events-none animate-in slide-in-from-bottom-10 md:slide-in-from-right-10 duration-500 ease-out px-2 max-md:pb-6">
            <div
                className="pointer-events-auto relative bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 md:top-4 right-3 md:right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90 z-10"
                >
                    <X size={16} className="md:w-4 md:h-4" />
                </button>

                <div className="p-3 md:p-6 text-start">
                    {/* Header */}
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-5">
                        <div className="w-8 h-8 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={14} className="md:w-[18px] md:h-[18px]" />
                        </div>
                        <div>
                            <h3 className="text-[11px] md:text-base font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">Product Added!</h3>
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest md:mt-0.5">
                                <span className="text-primary">{cartItemCount}</span> {cartItemCount === 1 ? 'item' : 'items'} in your bag
                            </p>
                        </div>
                    </div>

                    {/* Mobile: Name + Checkout (Single Line) */}
                    <div className="md:hidden flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-white/5">
                        <p className="flex-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">
                            <span className="text-slate-900 dark:text-white font-black">{addedProduct?.name}</span>
                        </p>
                        <button
                            onClick={handleCheckout}
                            className="shrink-0 bg-primary text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] flex items-center gap-1.5 active:scale-[0.95]"
                        >
                            Checkout
                            <ArrowRight size={10} />
                        </button>
                    </div>

                    {/* Desktop Layout (md and above) */}
                    <div className="hidden md:block">
                        {addedProduct && (
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 mb-5">
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">
                                    <span className="text-slate-900 dark:text-white font-black">{addedProduct.name}</span>
                                </p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-primary text-white py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all hover:shadow-[0_10px_20px_rgba(236,109,19,0.2)] active:scale-[0.98] group"
                            >
                                Checkout
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>

                            <button
                                onClick={handleViewCart}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-slate-900/5 dark:shadow-none"
                            >
                                <ShoppingBag size={14} />
                                Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPopup;
