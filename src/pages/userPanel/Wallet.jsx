import React, { useEffect, useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, Search, History, CreditCard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWallet } from '../../api/payment.api';
import { formatCurrency } from '../../utils/orderSummary';
import Skeleton from '../../components/common/Skeleton';

const Wallet = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const data = await getWallet();
                setWalletData(data);
            } catch (error) {
                console.error('Failed to fetch wallet:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    if (loading) {
        return (
            <div className="py-6">
                <div className="mb-10">
                    <Skeleton variant="title" width="200px" height="36px" className="mb-2" />
                    <Skeleton variant="text" width="250px" />
                </div>

                {/* Balance Card Skeleton */}
                <div className="relative mb-12">
                    <div className="bg-white dark:bg-slate-900 border border-white dark:border-slate-800 rounded-2xl p-8 lg:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
                        <div className="flex items-center gap-8 z-10 w-full md:w-auto">
                            <Skeleton variant="rectangular" width="80px" height="80px" className="rounded-2xl shrink-0" />
                            <div className="flex-1 space-y-3">
                                <Skeleton variant="text" width="120px" />
                                <Skeleton variant="title" width="200px" height="48px" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-end">
                            <Skeleton variant="rectangular" width="100px" height="56px" className="rounded-xl" />
                            <Skeleton variant="rectangular" width="140px" height="56px" className="rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Transactions Skeleton */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <Skeleton variant="title" width="180px" height="24px" />
                        <Skeleton variant="rectangular" width="80px" height="24px" className="rounded-full" />
                    </div>

                    <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/70 dark:bg-slate-900/40 border border-white dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-6">
                                <div className="flex items-center gap-6 flex-1">
                                    <Skeleton variant="rectangular" width="56px" height="56px" className="rounded-xl" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton variant="title" width="60%" height="18px" />
                                        <div className="flex gap-4">
                                            <Skeleton variant="text" width="120px" />
                                            <Skeleton variant="text" width="60px" />
                                        </div>
                                    </div>
                                </div>
                                <Skeleton variant="title" width="80px" height="28px" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const transactions = walletData?.transactions || [];

    return (
        <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">My Wallet</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Manage your refunds and credits</p>
            </div>

            {/* Balance Card */}
            <div className="relative mb-12 group">
                <div className="absolute -inset-1 rounded-2xl border-1 opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-white dark:border-slate-800 rounded-2xl p-8 lg:p-12  flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden font-bold">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="flex items-center gap-8 z-10">
                        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
                            <WalletIcon size={36} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2 leading-none">Available Balance</p>
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                                {formatCurrency(walletData?.balance || 0)}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 z-10">

                        <Link to="/shop" className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:bg-primary dark:hover:bg-primary hover:text-white transition-all active:scale-95">
                            Spend Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <History size={20} className="text-primary" />
                        Recent Transactions
                    </h3>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800">
                        {transactions.length} Records
                    </span>
                </div>

                {transactions.length === 0 ? (
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-slate-100 dark:border-slate-700">
                            <Search size={28} className="text-slate-200 dark:text-slate-700" />
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">No transactions found in your history</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {[...transactions].reverse().map((tx) => (
                            <div key={tx.id} className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between gap-6 transition-all hover:border-primary/20 hover:translate-x-1 group">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${tx.transaction_type === 'credit'
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border-emerald-100 dark:border-emerald-500/20'
                                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border-rose-100 dark:border-rose-500/20'
                                        }`}>
                                        {tx.transaction_type === 'credit' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white mb-1 group-hover:text-primary transition-colors">{tx.description}</h4>
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none flex items-center gap-1.5">
                                                <Clock size={12} className="opacity-50" />
                                                {new Date(tx.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${tx.transaction_type === 'credit' ? 'text-emerald-500 border-emerald-500/20' : 'text-rose-500 border-rose-500/20'
                                                }`}>
                                                {tx.transaction_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xl font-black tracking-tight ${tx.transaction_type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {tx.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Refund Info Alert */}
            <div className="mt-12 bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-slate-800 shadow-sm flex-none">
                    <CreditCard size={28} className="text-indigo-500" />
                </div>
                <div>
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-indigo-900 dark:text-indigo-400 mb-2">About Wallet Refunds</h5>
                    <p className="text-xs text-indigo-800/70 dark:text-indigo-300/60 font-black leading-relaxed">
                        When you cancel a paid order, your refund is processed instantly to this wallet. You can use this balance for any future purchases on MomsCrunch. Balance never expires.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
