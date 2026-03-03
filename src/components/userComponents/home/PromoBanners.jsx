import { ArrowUpRight } from 'lucide-react';

const bannerData = [
    {
        id: 1,
        tag: "Healthy Snack",
        icon: "🍃",
        title: "Homemade Thekua",
        description: "Light, crunchy & roasted snacks made with love.",
        bgColor: "bg-[#f0fbf0]",
        borderColor: "border-emerald-100",
        textColor: "text-emerald-700",
        btnBorder: "border-emerald-100",
        shadowColor: "hover:shadow-emerald-200/50",
        image: "banner/thekua.webp",
        gradientFrom: "from-[#f0fbf0]",
        gradientVia: "md:via-[#f0fbf0]/20",
        targetId: "thekua"
    },
    {
        id: 2,
        tag: "Authentic Taste",
        icon: "🌶️",
        title: "Homemade Achar",
        description: "Sun-dried recipes passed down through generations.",
        bgColor: "bg-[#fff8f0]",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        btnBorder: "border-orange-100",
        shadowColor: "hover:shadow-orange-200/50",
        image: "banner/achar.webp",
        gradientFrom: "from-[#fff8f0]",
        gradientVia: "md:via-[#fff8f0]/20",
        targetId: "achar"
    }
];

const PromoBannerCard = ({ banner }) => (
    <div className={`group relative flex flex-col md:flex-row h-[280px] md:h-[320px] rounded-2xl overflow-hidden ${banner.bgColor} border ${banner.borderColor} transition-all duration-500 hover:shadow-lg`}>
        <div className="flex-1 px-6 py-4 md:p-12 flex flex-col justify-center gap-4 md:gap-8 z-20 transition-transform duration-500 group-hover:-translate-x-1">
            <div className={`w-fit px-4 py-1.5 rounded-full bg-white ${banner.textColor} text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2`}>
                <span>{banner.icon}</span> {banner.tag}
            </div>
            <div className="space-y-3">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{banner.title}</h3>
                <p className="text-slate-800 text-sm md:text-base leading-relaxed">{banner.description}</p>
            </div>
            <button
                onClick={() => document.getElementById(banner.targetId)?.scrollIntoView({ behavior: 'smooth' })}
                className={`group/btn relative w-fit flex items-center cursor-pointer gap-3 px-10 py-2.5 rounded-full bg-white ${banner.textColor} font-black text-[10px] uppercase tracking-[0.2em] border ${banner.btnBorder} transition-all hover:shadow-2xl ${banner.shadowColor} hover:-translate-y-1 active:translate-y-0 active:scale-95`}
            >
                Explore <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
        </div>
        <div className="absolute inset-0 md:relative md:w-[50%] h-full overflow-hidden z-10">
            <img
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 origin-center md:origin-right"
                src={banner.image}
            />
            <div className={`absolute inset-0 bg-linear-to-r ${banner.gradientFrom} to-transparent ${banner.gradientVia} z-20`}></div>
        </div>
    </div>
);

const PromoBanners = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bannerData.map(banner => (
                <PromoBannerCard key={banner.id} banner={banner} />
            ))}
        </section>
    );
};

export default PromoBanners;
