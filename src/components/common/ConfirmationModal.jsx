import React from 'react';
import { X, AlertCircle, Trash2, Loader2 } from 'lucide-react';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message = "This action cannot be undone.", 
    confirmText = "Delete", 
    cancelText = "Cancel", 
    isLoading = false,
    variant = "danger" // "danger" or "warning"
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: <Trash2 size={24} className="text-red-500" />,
            button: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
            lightIconBg: "bg-red-50",
            darkIconBg: "dark:bg-red-500/10"
        },
        warning: {
            icon: <AlertCircle size={24} className="text-amber-500" />,
            button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
            lightIconBg: "bg-amber-50",
            darkIconBg: "dark:bg-amber-500/10"
        }
    };

    const currentVariant = variantStyles[variant] || variantStyles.danger;

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={isLoading ? null : onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white dark:border-white/5 animate-in zoom-in-95 duration-300">
                <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className={`w-12 h-12 rounded-2xl ${currentVariant.lightIconBg} ${currentVariant.darkIconBg} flex items-center justify-center`}>
                            {currentVariant.icon}
                        </div>
                        <button 
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-slate-400 transition-all disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                            {title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-6 py-4 ${currentVariant.button} text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50`}
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
