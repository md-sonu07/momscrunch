import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOurStory } from '../../redux/thunk/ourStoryThunk';
import { Leaf, ShieldCheck, Zap } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

const OurStory = () => {
    const dispatch = useDispatch();
    const { data: story, loading, error } = useSelector((state) => state.ourStory);

    useEffect(() => {
        dispatch(fetchOurStory());
    }, [dispatch]);

    if (loading && !story) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#1a130e] text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
                <div className="max-w-4xl sm:px-24 px-6 flex justify-start items-start flex-col mb-16">
                    <div className="flex items-center gap-3 mb-6 w-full">
                        <Skeleton variant="text" width="100px" />
                    </div>
                    <Skeleton variant="title" width="60%" height="48px" className="mb-4" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="40%" />
                </div>

                <div className="max-w-5xl mx-auto px-6 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <Skeleton variant="rectangular" height="350px" className="rounded-3xl" />
                        <div className="space-y-4">
                            <Skeleton variant="title" width="40%" />
                            <div className="space-y-2">
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="60%" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 mb-24">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center space-y-4">
                                <Skeleton variant="circular" width="48px" height="48px" className="mx-auto" />
                                <Skeleton variant="title" width="60%" className="mx-auto" />
                                <Skeleton variant="text" width="80%" className="mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    const values = [
        { id: "pure", icon: Leaf, title: "Pure Ingredients", desc: "No artificial preservatives or additives." },
        { id: "quality", icon: ShieldCheck, title: "Quality First", desc: "Rigorous checks at every step of the process." },
        { id: "fresh", icon: Zap, title: "Freshly Packed", desc: "Always delivered fresh for the ultimate crunch." }
    ];

    const highlight = "MomsCrunch";
    const titleParts = story?.title?.includes(highlight)
        ? [story.title.split(highlight)[0], highlight, story.title.split(highlight)[1]]
        : [story?.title || "", "", ""];

    return (
        <div className="min-h-screen bg-white dark:bg-[#1a130e] text-slate-800 dark:text-slate-200 selection:bg-primary pt-10 pb-24">
            {/* Unified Styled Header */}
            <div className="max-w-4xl sm:px-24 px-6 flex justify-start items-start flex-col mb-16">
                <div className="flex items-center gap-3 mb-3 text-primary">
                    <div className="h-[1.5px] w-8 bg-primary shadow-[0_0_8px_rgba(236,109,19,0.3)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Journey</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                    {titleParts[0]}
                    {titleParts[1] && <span className="text-primary italic">{titleParts[1]}</span>}
                    {titleParts[2]}
                </h1>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold max-w-lg">
                    {story.subtitle}
                </p>
            </div>

            {/* Backstory */}
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <img
                        src={story.image}
                        alt={story.title}
                        className="rounded-3xl shadow-sm object-cover aspect-4/3 w-full border border-slate-100 dark:border-slate-800"
                    />
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Heritage</h2>
                        {story.description.split('\n').filter(p => p.trim() !== '').map((p, i) => (
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
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 italic">Ready for a crunch?</h2>
                    <button className="bg-primary text-white cursor-pointer px-10 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                        Explore Our Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OurStory;
