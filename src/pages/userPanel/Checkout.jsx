import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    CreditCard,
    CheckCircle2,
    Truck,
    ShieldCheck,
    Clock,
    ShoppingBag
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const navigate = useNavigate();

    // Mock data - In a real app, this would come from Redux or Context
    const cartSummary = {
        subtotal: 1249,
        shipping: 0,
        tax: 62,
        total: 1311,
        items: [
            { id: 1, name: "Handcrafted Peri Peri Makhana", price: 249, quantity: 2, image: "🌶️", color: "bg-orange-50" },
            { id: 2, name: "Premium Roasted Cashews", price: 751, quantity: 1, image: "🥜", color: "bg-amber-50" }
        ]
    };

    const steps = [
        { id: 1, label: "Shipping", icon: MapPin },
        { id: 2, label: "Payment", icon: CreditCard },
        { id: 3, label: "Confirm", icon: CheckCircle2 }
    ];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Header & Back Button */}
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <button
                            onClick={() => step === 1 ? navigate('/profile/cart') : prevStep()}
                            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em] group mb-3 cursor-pointer"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            {step === 1 ? 'Back to Bucket' : 'Previous Step'}
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Secure <span className="text-primary italic">Checkout</span>
                        </h1>
                    </div>

                    {/* Stepper Logic - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {steps.map((s, idx) => (
                            <React.Fragment key={s.id}>
                                <div className={`flex items-center gap-3 ${step >= s.id ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${step >= s.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' : 'border-slate-100 dark:border-slate-800'}`}>
                                        <s.icon size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`w-12 h-0.5 rounded-full ${step > s.id ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Stepper Logic - Mobile simplified */}
                    <div className="md:hidden w-full space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>{steps[step - 1].label}</span>
                            <span className="text-primary">Step 0{step} / 03</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 order-2 lg:order-1 space-y-6 md:space-y-8">
                        {step === 1 && (
                            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Shipping Details</h2>
                                    <span className="hidden md:inline-block text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">Step 01/03</span>
                                </div>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input type="text" placeholder="John Doe" className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                                            <input type="tel" placeholder="+91 98765 43210" className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Complete Address</label>
                                        <textarea rows="3" placeholder="Flat/House No, Street, Area" className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none shadow-sm"></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">City</label>
                                            <input type="text" placeholder="Jaipur" className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Pin Code</label>
                                            <input type="text" placeholder="302001" className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">State</label>
                                            <select className="w-full bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer shadow-sm">
                                                <option>Rajasthan</option>
                                                <option>Maharashtra</option>
                                                <option>Delhi</option>
                                                <option>Karnataka</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Payment Method</h2>
                                    <span className="hidden md:inline-block text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">Step 02/03</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'upi', name: 'UPI / QR Code', icon: '📱', desc: 'Secure phone payment', popular: true },
                                        { id: 'card', name: 'Card Payment', icon: '💳', desc: 'Credit or Debit cards' },
                                        { id: 'net', name: 'Net Banking', icon: '🏦', desc: 'All Indian banks' },
                                        { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you crunch' }
                                    ].map((method) => {
                                        const isActive = paymentMethod === method.id;
                                        return (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-all relative overflow-hidden group active:scale-[0.98] ${isActive
                                                    ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10'
                                                    : 'bg-white/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                                    }`}
                                            >
                                                {method.popular && (
                                                    <div className="absolute top-2 right-2 bg-primary text-white text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full shadow-lg shadow-primary/20">
                                                        Popular
                                                    </div>
                                                )}

                                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-2xl shadow-sm border transition-all ${isActive
                                                    ? 'bg-white dark:bg-slate-900 border-primary/20 scale-105'
                                                    : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 group-hover:scale-105'
                                                    }`}>
                                                    {method.icon}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className={`text-[13px] font-black tracking-tight mb-0.5 transition-colors ${isActive ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                                        {method.name}
                                                    </h3>
                                                    <p className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-primary/60' : 'text-slate-400'}`}>
                                                        {method.desc}
                                                    </p>
                                                </div>

                                                <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isActive
                                                    ? 'border-primary bg-primary'
                                                    : 'border-slate-200 dark:border-slate-700 group-hover:border-slate-400'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-white transition-all ${isActive ? 'scale-100' : 'scale-0'}`} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="hidden md:block bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in zoom-in-95 duration-500 text-center">
                                <div className="relative w-32 h-32 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                    <div className="relative w-full h-full bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                                        <CheckCircle2 size={64} strokeWidth={2.5} />
                                    </div>
                                </div>

                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Almost There!</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-md mx-auto mb-12 leading-relaxed uppercase tracking-[0.2em]">
                                    Review your final order summary on the right and click "Complete Purchase" <br className="hidden lg:block" /> to finalize your handcrafted crunch order.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto border-t border-slate-100 dark:border-slate-800 pt-10">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary"><Truck size={20} /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery</div>
                                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">Mar 15 - Mar 18</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary"><ShieldCheck size={20} /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality</div>
                                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">100% Organic</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-primary"><Clock size={20} /></div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch</div>
                                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">Within 24 Hours</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Actions for Desktop / Mobile */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                            {step < 3 ? (
                                <>
                                    <div className="flex items-center gap-3 text-slate-400 order-2 md:order-1">
                                        <ShieldCheck size={18} className="text-green-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-left">Guaranteed SSL Security</span>
                                    </div>
                                    <button
                                        onClick={nextStep}
                                        className="w-full md:w-auto bg-primary text-white px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group cursor-pointer order-1 md:order-2"
                                    >
                                        Proceed to {step === 1 ? 'Payment' : 'Review'}
                                        <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                    </button>
                                </>
                            ) : null}
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="lg:col-span-4 order-1 lg:order-2 lg:sticky top-32">
                        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                <ShoppingBag size={20} className="text-primary" />
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Order Summary</h2>
                            </div>

                            {/* Summary Items List */}
                            <div className="space-y-4 mb-8 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartSummary.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0`}>
                                            {item.image}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{item.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                                        </div>
                                        <div className="text-sm font-black text-slate-900 dark:text-white tabular-nums">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8 mb-8">
                                <div className="flex justify-between items-center text-sm font-bold text-slate-400 group">
                                    <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{cartSummary.subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-slate-400 group">
                                    <span className="uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className="text-green-500 uppercase tracking-widest text-[10px] font-black underline underline-offset-4 decoration-2">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-slate-400 group">
                                    <span className="uppercase tracking-widest text-[10px]">Tax (GST)</span>
                                    <span className="text-slate-900 dark:text-white tabular-nums">₹{cartSummary.tax}</span>
                                </div>

                                <div className="pt-6 border-t-2 border-dashed border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-white font-black uppercase tracking-[0.2em] text-[10px]">Grand Total</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Payable Amount</span>
                                    </div>
                                    <span className="text-3xl font-black text-primary tabular-nums tracking-tighter">₹{cartSummary.total}</span>
                                </div>
                            </div>

                            {/* Complete Purchase Button - Desktop Only */}
                            {step === 3 && (
                                <div className="hidden lg:block mt-8">
                                    <button className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 group cursor-pointer active:translate-y-0 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                                        Complete Purchase
                                        <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
                                    </button>
                                </div>
                            )}

                            {/* Security Badges */}
                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Authentic <br />Quality Guaranteed</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                                        <Truck size={16} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Express <br />Doorstep Delivery</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Floating Purchase Slip - Step 3 Mobile Only */}
            {step === 3 && (
                <div className="md:hidden fixed bottom-28 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-700">
                    <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white dark:border-slate-800 rounded-3xl p-6 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden sm:group">
                        {/* Receipt Aesthetic: Decorative cutouts and lines */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-100 dark:bg-slate-800 rounded-b-xl" />
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full border-r border-slate-100 dark:border-slate-800" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background-light dark:bg-background-dark rounded-full border-l border-slate-100 dark:border-slate-800" />

                        <div className="flex flex-col gap-6">
                            {/* Summary Header */}
                            <div className="flex items-center justify-between border-b border-dashed border-slate-100 dark:border-slate-800 pb-5">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Crunch Count</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center text-[10px] font-black text-primary">
                                            {cartSummary.items.reduce((acc, item) => acc + item.quantity, 0)}
                                        </div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Items Selected</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Amount</div>
                                    <div className="text-2xl font-black text-primary tabular-nums tracking-tighter">₹{cartSummary.total}</div>
                                </div>
                            </div>

                            {/* Almost There Section - Mobile Optimized */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-primary/20">
                                        <CheckCircle2 size={18} strokeWidth={3} />
                                    </div>
                                    <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1">Almost There!</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Final Crunch Verification</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-4 px-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="flex flex-col items-center text-center gap-1.5 border-r border-slate-200 dark:border-slate-700">
                                        <Truck size={14} className="text-primary" />
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Delivery</div>
                                        <div className="text-[9px] font-extrabold text-slate-900 dark:text-white">Mar 15-18</div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5 border-r border-slate-200 dark:border-slate-700">
                                        <ShieldCheck size={14} className="text-primary" />
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Quality</div>
                                        <div className="text-[9px] font-extrabold text-slate-900 dark:text-white">100% Organic</div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <Clock size={14} className="text-primary" />
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dispatch</div>
                                        <div className="text-[9px] font-extrabold text-slate-900 dark:text-white">24 Hours</div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
                                Complete Purchase
                                <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>

                            <p className="text-[7.5px] text-center font-black text-slate-400 uppercase tracking-widest opacity-60">
                                Secure Payment • 100% Authentic Quality
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
