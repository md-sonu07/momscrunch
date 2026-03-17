import React, { useEffect, useState } from 'react';
import { Package, Search, ChevronRight, Clock, CheckCircle2, Truck, XCircle, CreditCard, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/thunk/orderThunk';
import { selectOrders } from '../../redux/slice/orderSlice';
import { formatCurrency } from '../../utils/orderSummary';
import { cancelOrder } from '../../api/order.api';
import toast from 'react-hot-toast';
import Skeleton from '../../components/common/Skeleton';

const ActiveOrders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const { loading } = useSelector((state) => state.orders);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'
    const [cancellingId, setCancellingId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(null); // stores order details for modal

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleCancelOrder = async (orderId) => {
        setCancellingId(orderId);
        try {
            await cancelOrder(orderId);
            toast.success('Order cancelled successfully');
            dispatch(fetchOrders());
            setShowCancelModal(null);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to cancel order');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-600',
                    icon: <Clock size={14} />,
                    dot: 'bg-amber-500'
                };
            case 'paid':
                return {
                    bg: 'bg-blue-500/10',
                    text: 'text-blue-600',
                    icon: <CheckCircle2 size={14} />,
                    dot: 'bg-blue-500'
                };
            case 'shipped':
                return {
                    bg: 'bg-indigo-500/10',
                    text: 'text-indigo-600',
                    icon: <Truck size={14} />,
                    dot: 'bg-indigo-500'
                };
            case 'delivered':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-600',
                    icon: <CheckCircle2 size={14} />,
                    dot: 'bg-emerald-500'
                };
            case 'cancelled':
                return {
                    bg: 'bg-rose-500/10',
                    text: 'text-rose-600',
                    icon: <XCircle size={14} />,
                    dot: 'bg-rose-500'
                };
            default:
                return {
                    bg: 'bg-slate-500/10',
                    text: 'text-slate-600',
                    icon: <Package size={14} />,
                    dot: 'bg-slate-500'
                };
        }
    };

    const filteredOrders = orders.filter(order => {
        const isPast = ['delivered', 'cancelled'].includes(order.status.toLowerCase());
        return activeTab === 'active' ? !isPast : isPast;
    });

    if (loading && orders.length === 0) {
        return (
            <div className="py-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <div>
                        <Skeleton variant="title" width="220px" height="36px" className="mb-2" />
                        <Skeleton variant="text" width="280px" />
                    </div>
                    <Skeleton variant="rectangular" width="180px" height="48px" className="rounded-2xl" />
                </div>

                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/70 dark:bg-slate-900/40 border border-white dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <Skeleton variant="rectangular" width="64px" height="64px" className="rounded-2xl shrink-0" />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Skeleton variant="title" width="120px" height="24px" />
                                            <Skeleton variant="rectangular" width="80px" height="24px" className="rounded-full" />
                                        </div>
                                        <Skeleton variant="text" width="150px" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-6 lg:pt-0">
                                    <div className="text-center lg:text-right space-y-2">
                                        <Skeleton variant="text" width="80px" />
                                        <Skeleton variant="title" width="100px" height="28px" />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="w-full flex gap-4 py-4">
                                    <Skeleton variant="rectangular" width="180px" height="64px" className="rounded-xl shrink-0" />
                                    <Skeleton variant="rectangular" width="180px" height="64px" className="rounded-xl shrink-0" />
                                </div>
                                <div className="flex flex-row md:flex-col gap-3 py-4 w-full md:w-auto shrink-0">
                                    <Skeleton variant="rectangular" width="140px" height="44px" className="rounded-xl" />
                                    <Skeleton variant="rectangular" width="140px" height="44px" className="rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Order History</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Track and manage your handcrafted treats</p>
                </div>

                {/* Custom Tabs */}
                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 w-fit">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-6 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'past' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[40vh] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 shadow-inner">
                        <Package size={32} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">No {activeTab} Orders Found</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-xs mb-10 leading-relaxed uppercase tracking-[0.2em]">
                        {activeTab === 'active' ? "You don't have any active orders right now." : "You haven't completed or cancelled any orders yet."}
                    </p>
                    <Link
                        to="/shop"
                        className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                    >
                        <Search size={16} className="group-hover:rotate-12 transition-transform" />
                        Explore Our Cookies
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {[...filteredOrders].reverse().map((order) => {
                        const style = getStatusStyles(order.status);
                        const canCancel = ['pending', 'paid'].includes(order.status.toLowerCase());

                        return (
                            <div key={order.id} className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:border-primary/20 group">
                                <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-500">
                                            <Package size={28} className="text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Order #{order.id}</h3>
                                                <div className={`flex items-center gap-1.5 px-3 py-1 ${style.bg} ${style.text} rounded-full text-[9px] font-black uppercase tracking-widest border border-current shadow-sm`}>
                                                    <span className={`w-1.5 h-1.5 ${style.dot} rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]`}></span>
                                                    {order.status}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-6 lg:pt-0">
                                        <div className="text-center lg:text-right">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Amount Paid</p>
                                            <p className="text-xl font-black text-primary tracking-tight">{formatCurrency(order.final_price)}</p>
                                        </div>

                                        <div className="flex items-center gap-3 ml-auto">
                                            {/* Buttons moved to bottom section */}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="w-full overflow-x-auto no-scrollbar">
                                        <div className="flex items-center gap-4 py-4 min-w-max">
                                            {order.items?.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={`/product/${item.product_slug}`}
                                                    className="flex-none flex items-center gap-3 bg-white dark:bg-slate-900 p-2 pr-4 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/40 hover:shadow-md transition-all active:scale-95 group/item cursor-pointer"
                                                >
                                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 relative group/thumb">
                                                        {item.product_image ? (
                                                            <img
                                                                src={item.product_image}
                                                                alt={item.product_variant_name}
                                                                className="w-full h-full object-contain transform transition-transform group-hover/thumb:scale-110"
                                                            />
                                                        ) : (
                                                            <Package size={20} className="text-slate-200 dark:text-slate-700" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px] group-hover/item:text-primary transition-colors">
                                                            {item.product_variant_name || 'Item Name'}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                                            {item.weight} • {item.quantity} Unit{item.quantity > 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col gap-3 py-4 w-full md:w-auto shrink-0">
                                        {canCancel && (
                                            <button
                                                onClick={() => setShowCancelModal(order)}
                                                className="flex-1 h-11 px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-rose-200/50 dark:border-rose-500/20 hover:bg-red-600 hover:text-white transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <Link
                                            to={`/profile/orders/${order.id}`}
                                            className="flex-1 h-11 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:shadow-sm hover:shadow-primary/30 hover:-translate-y-0.5 transition-all group active:scale-95 whitespace-nowrap"
                                        >
                                            <span>View Details</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowCancelModal(null)}></div>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-rose-100 dark:border-rose-500/20">
                            <AlertTriangle size={36} className="text-rose-600" />
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Cancel Order?</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">
                                Are you sure you want to cancel order #{showCancelModal.id}?
                            </p>
                        </div>

                        {showCancelModal.status.toLowerCase() === 'paid' && (
                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-500 text-white rounded-lg">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-1">Refund Notice</h4>
                                        <p className="text-xs text-amber-700 dark:text-amber-500/80 font-bold leading-relaxed">
                                            A cancellation charge may be deducted. The remaining amount will be credited to your <span className="text-amber-900 dark:text-amber-300 font-black">MomsCrunch Wallet</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleCancelOrder(showCancelModal.id)}
                                disabled={cancellingId === showCancelModal.id}
                                className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-rose-600/20 hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                            >
                                {cancellingId === showCancelModal.id ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : 'Yes, Cancel Order'}
                            </button>
                            <button
                                onClick={() => setShowCancelModal(null)}
                                className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                No, Keep Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveOrders;
