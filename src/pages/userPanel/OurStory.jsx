import React from 'react';
import { Leaf, Heart, ShieldCheck, Zap } from 'lucide-react';

const storyData = {
    header: {
        tag: "Our Journey",
        title: "MomsCrunch Story",
        highlight: "MomsCrunch",
        subtitle: "A simple promise: handcrafted snacks with no compromises on taste or health."
    },
    backstory: {
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop",
        title: "The Beginning",
        paragraphs: [
            "MomsCrunch started in 2021 with a simple goal: to share the authentic, crunchy flavors of Rajasthan with the world. Inspired by age-old family recipes, we focus on small batches and high-quality ingredients.",
            "Every pack of snacks is a testament to our commitment to quality. From our spicy Achars to our healthy Makhanas, we ensure everything is handcrafted with care."
        ]
    },
    values: [
        { id: "pure", icon: Leaf, title: "Pure Ingredients", desc: "No artificial preservatives or additives." },
        { id: "quality", icon: ShieldCheck, title: "Quality First", desc: "Rigorous checks at every step of the process." },
        { id: "fresh", icon: Zap, title: "Freshly Packed", desc: "Always delivered fresh for the ultimate crunch." }
    ],
    cta: {
        title: "Ready for a crunch?",
        buttonText: "Explore Our Shop"
    }
};

const OurStory = () => {
    const { header, backstory, values, cta } = storyData;

    return (
        <div className="min-h-screen bg-white dark:bg-[#1a130e] text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
            {/* Unified Styled Header */}
            <div className="max-w-4xl sm:px-24 px-6 flex justify-start items-start flex-col mb-16">
                <div className="flex items-center gap-3 mb-3 text-primary">
                    <div className="h-[1.5px] w-8 bg-primary shadow-[0_0_8px_rgba(236,109,19,0.3)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{header.tag}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                    {header.title.split(header.highlight)[0]}
                    <span className="text-primary italic">{header.highlight}</span>
                    {header.title.split(header.highlight)[1]}
                </h1>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold max-w-lg">
                    {header.subtitle}
                </p>
            </div>

            {/* Backstory */}
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <img
                        src={backstory.image}
                        alt={backstory.title}
                        className="rounded-3xl shadow-sm object-cover aspect-4/3 w-full border border-slate-100 dark:border-slate-800"
                    />
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{backstory.title}</h2>
                        {backstory.paragraphs.map((p, i) => (
                            <p key={i} className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                {p}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="max-w-6xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {values.map((item) => (
                        <div key={item.id} className="text-center space-y-4">
                            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center mx-auto">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Simple CTA */}
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 italic">{cta.title}</h2>
                    <button className="bg-primary text-white cursor-pointer px-10 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                        {cta.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OurStory;
