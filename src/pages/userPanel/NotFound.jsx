import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 md:px-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />

            <div className="text-center max-w-lg mx-auto">
                

                <h1 className="text-8xl md:text-9xl font-black text-slate-100 dark:text-slate-800/30 select-none mb-4 tracking-tighter">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    Oops! Page Not Found
                </h2>

                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                    The page you're looking for might have been moved, deleted, or never existed in the first place. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="group flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 h-14 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-primary dark:hover:bg-primary hover:text-white transition-all active:scale-95 w-full sm:w-auto"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center justify-center gap-3 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white px-8 h-14 rounded-xl font-black text-xs uppercase tracking-[0.15em] border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all active:scale-95 w-full sm:w-auto"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                </div>
            </div>

            {/* Decorative Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-primary/10 animate-pulse delay-700" />
            <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-primary/5 animate-bounce delay-1000" />
        </div>
    );
};

export default NotFound;
