import React from 'react';
import { Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActiveOrders = () => {
    return (
        <div className="py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <Package size={40} className="text-slate-300 dark:text-slate-600" />
                </div>

                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">No Active Orders</h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm max-w-xs mb-10 leading-relaxed uppercase tracking-[0.2em]">
                    You don't have any ongoing orders at the moment.
                </p>

                <Link
                    to="/shop"
                    className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                >
                    <Search size={16} className="group-hover:rotate-12 transition-transform" />
                    Browse Products
                </Link>
            </div>
        </div>
    );
};

export default ActiveOrders;
