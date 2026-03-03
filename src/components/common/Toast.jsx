import React, { useEffect } from 'react';
import { Check, X, ShoppingBag, ArrowRight } from 'lucide-react';

const Toast = ({ message, isOpen, onClose, type = "success" }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-600 w-full max-w-sm px-4 md:px-0 pointer-events-none">
            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-slate-100 dark:border-white/10 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in duration-500 pointer-events-auto">
                {/* Product Icon/Visual */}
                <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        <ShoppingBag className="text-primary" size={24} strokeWidth={2.5} />
                    </div>
                    {/* Status Dot */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                        <Check size={10} className="text-white" strokeWidth={4} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Added to Bucket</h4>
                    </div>
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate pr-2">{message}</p>
                </div>

                {/* Close/Action */}
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-all cursor-pointer group"
                >
                    <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Premium Progress Loader */}
                <div className="absolute bottom-0 left-6 right-6 h-[2.5px] bg-slate-100 dark:bg-white/10 overflow-hidden rounded-full">
                    <div className="h-full bg-linear-to-r from-primary to-orange-400 animate-progress origin-left"></div>
                </div>
            </div>
        </div>
    );
};

export default Toast;
