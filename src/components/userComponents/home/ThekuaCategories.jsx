import React from 'react'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../../common/ProductCard';
import { Link } from 'react-router-dom';

const thekuaData = [
    {
        id: 1,
        name: "Authentic Wheat Thekua",
        image: "https://images.unsplash.com/photo-1605085112728-3cdbb6241f2d?q=80&w=800&auto=format&fit=crop",
        tag: "Best Seller",
        tagBg: "bg-orange-500/90",
        rating: 5,
        reviews: 124,
        weight: "500g Traditional Pack",
        oldPrice: 249,
        price: 199,
        themeColor: "emerald"
    },
    {
        id: 2,
        name: "Gud (Jaggery) Thekua",
        image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=800&auto=format&fit=crop",
        tag: "Specialty",
        tagBg: "bg-amber-600/90",
        rating: 4,
        reviews: 86,
        weight: "400g Artisanal Pack",
        oldPrice: 299,
        price: 249,
        themeColor: "emerald"
    },
    {
        id: 3,
        name: "Mix Dry Fruit Thekua",
        image: "https://images.unsplash.com/photo-1599596395112-9dae07b8b2cb?q=80&w=800&auto=format&fit=crop",
        tag: "Premium",
        tagBg: "bg-rose-500/90",
        rating: 5,
        reviews: 42,
        weight: "400g Premium Pack",
        oldPrice: 399,
        price: 349,
        themeColor: "emerald"
    }
];

const ThekuaCategories = ({ products, loading }) => {
    // if (loading && (!products || products.length === 0)) {
    //     return <div className="text-center py-20 text-slate-500">Loading traditional thekuas...</div>;
    // }

    const displayProducts = products && products.length > 0 ? products : thekuaData;

    return (
        <section id="thekua" className="px-4 sm:px-6 py-12 scroll-mt-24">
            <div className="flex justify-between items-end mb-10 max-w-7xl mx-auto">
                <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1.5px] w-8 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">Our Selection</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Traditional Thekua</h2>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-12 hide-scrollbar max-w-7xl mx-auto px-1">
                {displayProducts.map(product => (
                    <ProductCard key={product.id} product={{ ...product, themeColor: 'emerald' }} />
                ))}
            </div>

            <div className="flex justify-center">
                <Link to="/shop" className="group inline-flex items-center cursor-pointer gap-2 text-emerald-600 text-xs font-black uppercase tracking-[0.2em] border-b border-emerald-500/20 hover:border-emerald-500 transition-all pb-1">
                    View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    );
};

export default ThekuaCategories;