import React from 'react'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../../common/ProductCard';
import { Link } from 'react-router-dom';

const acharData = [
    {
        id: 1,
        name: "Rajasthani Garlic Achar",
        image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop",
        tag: "Top Rated",
        tagBg: "bg-emerald-500/90",
        rating: 4,
        reviews: 94,
        weight: "250g Glass Jar",
        oldPrice: 175,
        price: 149,
        themeColor: "orange"
    },
    {
        id: 2,
        name: "Traditional Mango Achar",
        image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop",
        tag: "Classic",
        tagBg: "bg-amber-500/90",
        rating: 5,
        reviews: 156,
        weight: "500g Glass Jar",
        oldPrice: 299,
        price: 249,
        themeColor: "orange"
    },
    {
        id: 3,
        name: "Spicy Lemon Achar",
        image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=800&auto=format&fit=crop",
        tag: "Spiced",
        tagBg: "bg-yellow-500/90",
        rating: 4,
        reviews: 62,
        weight: "250g Glass Jar",
        oldPrice: 199,
        price: 169,
        themeColor: "orange"
    }
];

const AcharCategories = ({ products, loading }) => {
    if (loading && (!products || products.length === 0)) {
        return <div className="text-center py-20 text-slate-500">Loading authentic pickles...</div>;
    }

    const displayProducts = products && products.length > 0 ? products : acharData;

    return (
        <section id="achar" className="px-4 sm:px-6 py-12 scroll-mt-24">
            <div className="flex justify-between items-end mb-10 max-w-7xl mx-auto">
                <div className="relative">

                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[1.5px] w-8 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]"></div>
                        <span className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em]">Our Selection</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Authentic Achar</h2>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-12 hide-scrollbar max-w-7xl mx-auto px-1">
                {displayProducts.map(product => (
                    <ProductCard key={product.id} product={{ ...product, themeColor: 'orange' }} />
                ))}
            </div>


            <div className="flex justify-center">
                <Link to="/shop" className="group inline-flex items-center gap-2 text-orange-600 text-xs font-black uppercase tracking-[0.2em] border-b border-orange-500/20 hover:border-orange-500 transition-all pb-1">
                    View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    );
};

export default AcharCategories;
