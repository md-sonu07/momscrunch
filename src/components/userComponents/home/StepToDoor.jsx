import React from 'react'
import { Leaf, BookOpen, Layers, Truck } from 'lucide-react'

const stepsData = [
    {
        id: "01",
        title: "Raw Sourcing",
        description: "Premium quality ingredients sourced direct from local farmers.",
        icon: Leaf,
        colorClass: "text-emerald-600",
        bgColor: "shadow-emerald-500/10",
        borderColor: "border-emerald-50 dark:border-emerald-900/30",
        hoverColor: "group-hover:text-emerald-100 dark:group-hover:text-emerald-900/30",
        rotate: "group-hover:rotate-3"
    },
    {
        id: "02",
        title: "Dadi's Recipe",
        description: "Authentic sun-dried recipes with absolutely zero preservatives.",
        icon: BookOpen,
        colorClass: "text-orange-600",
        bgColor: "shadow-orange-500/10",
        borderColor: "border-orange-50 dark:border-orange-900/30",
        hoverColor: "group-hover:text-orange-100 dark:group-hover:text-orange-900/30",
        rotate: "group-hover:-rotate-3"
    },
    {
        id: "03",
        title: "Small Batches",
        description: "Hand-crafted in small batches to ensure consistent peak quality.",
        icon: Layers,
        colorClass: "text-blue-600",
        bgColor: "shadow-blue-500/10",
        borderColor: "border-blue-50 dark:border-blue-900/30",
        hoverColor: "group-hover:text-blue-100 dark:group-hover:text-blue-900/30",
        rotate: "group-hover:rotate-3"
    },
    {
        id: "04",
        title: "Express Delivery",
        description: "Carefully packed and shipped fresh directly from our kitchen.",
        icon: Truck,
        colorClass: "text-primary",
        bgColor: "shadow-primary/10",
        borderColor: "border-primary/10 dark:border-primary/30",
        hoverColor: "group-hover:text-primary/10 dark:group-hover:text-primary/30",
        rotate: "group-hover:-rotate-3"
    }
];

const StepToDoor = () => {
    return (
        <section className="py-20 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 relative overflow-hidden">
            {/* Decorative Background Element */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent">
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-2">
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Our Process</span>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Purity Promised in 4 Simple Steps
                    </h3>
                </div>

                <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-16 lg:gap-8">
                    {/* Horizontal Connecting Line (Desktop) */}
                    <div
                        className="hidden lg:block absolute top-8 left-0 w-full h-px border-t-2 border-dashed border-slate-200 dark:border-slate-800 -z-0">
                    </div>

                    {/* Vertical Connecting Line (Mobile/Tablet Central Spine) */}
                    <div
                        className="lg:hidden absolute left-1/2 top-8 bottom-32 w-px border-l-2 border-dashed border-slate-200 dark:border-slate-800 -translate-x-1/2 -z-0">
                    </div>

                    {stepItems}
                </div>
            </div>
        </section>
    )
}

const stepItems = stepsData.map((step) => {
    const Icon = step.icon;
    return (
        <div
            key={step.id}
            className="group relative flex flex-col items-center text-center z-10 transition-transform duration-300 hover:-translate-y-2"
        >
            <div className="relative mb-6">
                <span
                    className={`absolute -top-4 -right-4 text-4xl font-black text-slate-200/50 dark:text-slate-800/50 select-none ${step.hoverColor} transition-colors`}
                >
                    {step.id}
                </span>
                <div
                    className={`size-16 rounded-xl bg-white dark:bg-slate-800 shadow-xl ${step.bgColor} flex items-center justify-center ${step.colorClass} border ${step.borderColor} transition-all group-hover:scale-110 ${step.rotate}`}
                >
                    <Icon size={28} strokeWidth={2.5} />
                </div>
            </div>
            <h5 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
                {step.title}
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[150px]">
                {step.description}
            </p>
        </div>
    );
});

export default StepToDoor