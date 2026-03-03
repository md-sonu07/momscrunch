import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ChevronLeft, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    // Mock data for the cart
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Handcrafted Peri Peri Makhana",
            category: "Roasted Makhana",
            price: 199,
            quantity: 2,
            image: "🌶️",
            color: "bg-red-50 dark:bg-red-500/10"
        },
        {
            id: 2,
            name: "Classic Salted Roasted Almonds",
            category: "Premium Nuts",
            price: 449,
            quantity: 1,
            image: "🥜",
            color: "bg-orange-50 dark:bg-orange-500/10"
        }
    ]);

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id) => {
        const item = cartItems.find(i => i.id === id);
        setCartItems(prev => prev.filter(item => item.id !== id));
        toast.success(`${item?.name} removed from bag`, {
            style: {
                borderRadius: '16px',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px'
            },
        });
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 49;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + shipping + tax;

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

                    {subtotal > 500 && (
                        <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-500/80 px-4 py-2 rounded-xl border border-green-500/20 text-[10px] font-black uppercase tracking-widest w-fit">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            Free Shipping Eligible
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-3 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-xl p-3 shadow-xl shadow-slate-200/50 dark:shadow-none grid grid-cols-[120px_1fr] gap-x-5 items-center relative group transition-all hover:border-primary/20">
                                {/* Left side: Image */}
                                <div className={`aspect-square ${item.color} rounded-2xl flex items-center justify-center text-4xl shadow-inner`}>
                                    {item.image}
                                </div>

                                {/* Right side: Details & Controls */}
                                <div className="flex flex-col justify-between py-0.5">
                                    {/* Top Section: Category, Name & Price */}
                                    <div className="pr-10">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">{item.category}</div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-0.5">
                                            {item.name}
                                        </h3>
                                        <div className="text-[11px] font-bold text-slate-400">₹{item.price} / unit</div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800/50 my-2" />

                                    {/* Bottom Section: Quantity & Total */}
                                    <div className="flex items-center justify-between">
                                        {/* Compact Quantity Toggle */}
                                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-100 dark:border-slate-700">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors active:scale-90"
                                            >
                                                <Minus size={12} />
                                            </button>

                                            <span className="w-7 text-center text-[13px] font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors active:scale-90"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums">₹{item.price * item.quantity}</div>
                                    </div>
                                </div>

                                {/* Floating Remove Button */}
                                <button
                                    onClick={() => removeItem(item.id)}
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
                                    <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                    <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="text-green-500 uppercase tracking-widest text-[10px] font-black underline underline-offset-4 decoration-2">Free</span>
                                    ) : (
                                        <span className="text-slate-900 dark:text-white tabular-nums">₹{shipping}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                    <span className="uppercase tracking-widest text-[10px]">Tax (GST)</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{tax}</span>
                                </div>
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-2">
                                    <span className="text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] text-xs">Total Amount</span>
                                    <span className="text-3xl font-black text-primary tabular-nums">₹{total}</span>
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
