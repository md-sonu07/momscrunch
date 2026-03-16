import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Package, MapPin, CreditCard, Clock,
    CheckCircle2, Box, Truck, ShieldCheck, ArrowRight,
    ShoppingBag, Download, AlertCircle
} from 'lucide-react';
import { getOrderDetails } from '../../api/order.api';
import { formatCurrency } from '../../utils/orderSummary';
import { toast } from 'react-hot-toast';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getOrderDetails(id);
                setOrder(data);
            } catch (error) {
                toast.error('Failed to load order details');
                navigate('/profile/orders');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const getStatusStyles = (status) => {
        const s = status.toLowerCase();
        if (s === 'delivered') return { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', icon: CheckCircle2 };
        if (s === 'cancelled') return { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500', icon: AlertCircle };
        if (s === 'shipped') return { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500', icon: Truck };
        if (s === 'paid') return { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', icon: CreditCard };
        return { bg: 'bg-slate-50 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400', icon: Clock };
    };

    const statusStyle = getStatusStyles(order.status);
    const StatusIcon = statusStyle.icon;

    return (
        <div className="space-y-8 pt-10 pb-30 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link
                        to="/profile/orders"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-[0.2em] group mb-3"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                        Order <span className="text-primary italic">#{order.id}</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                <div className={`flex items-center gap-3 px-6 py-3 ${statusStyle.bg} ${statusStyle.text} rounded-xl border border-current shadow-sm`}>
                    <StatusIcon size={20} className="animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{order.status_display}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-8">
                            <ShoppingBag size={20} className="text-primary" />
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Order Items</h2>
                        </div>

                        <div className="space-y-6">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/20 group">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100 dark:border-slate-800">
                                        {item.product_image ? (
                                            <img src={item.product_image} alt={item.product_variant_name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200"><Package size={32} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-900 dark:text-white mb-1 truncate">{item.product_variant_name}</h4>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <span>Weight: {item.weight}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-primary italic">₹{formatCurrency(item.price)}</p>
                                        <p className="text-[10px] font-bold text-slate-400 line-through">₹{formatCurrency(item.price * 1.2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Subtotal</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">₹{formatCurrency(order.total_price)}</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Discount</p>
                                <p className="text-sm font-black text-emerald-500">-₹{formatCurrency(order.discount_price)}</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Tax/Gst</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">Included</p>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Grand Total</p>
                                <p className="text-xl font-black text-primary">₹{formatCurrency(order.final_price)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Tracking (Mockup for now) */}
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-8">
                            <Clock size={20} className="text-primary" />
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Order Timeline</h2>
                        </div>

                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                            {[
                                { status: 'pending', label: 'Order Placed', date: order.created_at, desc: 'We have received your order.' },
                                { status: 'paid', label: 'Payment Confirmed', date: order.created_at, desc: 'Payment has been successfully verified.' },
                                { status: 'shipped', label: 'Order Shipped', date: null, desc: 'Your cookies are on the way!' },
                                { status: 'delivered', label: 'Delivered', date: null, desc: 'Enjoy your handcrafted treats!' }
                            ].map((step, idx) => {
                                const isCompleted = ['pending', 'paid', 'shipped', 'delivered'].indexOf(order.status) >= ['pending', 'paid', 'shipped', 'delivered'].indexOf(step.status);
                                const isCurrent = order.status === step.status;

                                return (
                                    <div key={idx} className={`relative ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`absolute -left-[27px] w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${isCompleted ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                            {isCurrent && <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25"></div>}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-black ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</h4>
                                            <p className="text-[10px] text-slate-500 font-medium mb-1">{step.desc}</p>
                                            {step.date && isCompleted && (
                                                <p className="text-[9px] text-primary font-bold uppercase tracking-widest">
                                                    {new Date(step.date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Address & Payment Info */}
                <div className="space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-6">
                            <MapPin size={20} className="text-primary" />
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Delivery Details</h2>
                        </div>

                        {order.shipping_address ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Recipient</p>
                                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{order.shipping_address.name}</p>
                                    <p className="text-xs font-bold text-slate-500">{order.shipping_address.phone}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Address</p>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                        {order.shipping_address.street}<br />
                                        {order.shipping_address.landmark && <>{order.shipping_address.landmark}<br /></>}
                                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pin_code}<br />
                                        {order.shipping_address.country}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs font-bold text-slate-400 italic">No delivery address recorded for this order.</p>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-6">
                            <CreditCard size={20} className="text-primary" />
                            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Payment Info</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Payment Method</p>
                                <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    Razorpay Online
                                </p>
                            </div>
                            {order.razorpay_order_id && (
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Order ID</p>
                                    <code className="text-[10px] font-bold text-primary truncate block bg-primary/5 p-2 rounded-lg border border-primary/10">
                                        {order.razorpay_order_id}
                                    </code>
                                </div>
                            )}
                            {order.razorpay_payment_id && (
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Payment ID</p>
                                    <code className="text-[10px] font-bold text-slate-900 dark:text-white truncate block bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                        {order.razorpay_payment_id}
                                    </code>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
                        <button className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-primary dark:hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg group">
                            <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                            Download Invoice
                        </button>
                        <button className="w-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all active:scale-95">
                            Need Help?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
