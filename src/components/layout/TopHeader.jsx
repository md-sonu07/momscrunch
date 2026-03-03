import { Truck, Tag } from 'lucide-react';

const TopHeader = () => {
    return (
        <div className="bg-[#0f172a] text-white py-2 px-4 border-b border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-10">
                <div className="flex items-center gap-3 group/item cursor-default">
                    <Truck className="text-primary w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Free Shipping over
                        ₹499</p>
                </div>
                <div className="h-4 w-px bg-slate-700 hidden md:block"></div>
                <div className="hidden md:flex items-center gap-3 group/item cursor-default">
                    <Tag className="text-primary w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Use Code: <span
                        className="text-primary">MOM10</span> for 10% OFF</p>
                </div>
            </div>
            <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none">
            </div>
        </div>
    )
}

export default TopHeader;