import React, { useState } from 'react';
import ProductCard from '../../components/common/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const allProductsData = [
    {
        id: 1,
        category: "Achar",
        name: "Rajasthani Garlic Achar",
        image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop",
        tag: "Top Rated",
        tagBg: "bg-emerald-500/90",
        rating: 4,
        reviews: 94,
        weight: "250g Glass Jar",
        oldPrice: 175,
        price: 149,
        themeColor: "emerald"
    },
    {
        id: 2,
        category: "Achar",
        name: "Traditional Mango Achar",
        image: "https://images.unsplash.com/photo-1589113103503-496550346c1f?q=80&w=800&auto=format&fit=crop",
        tag: "Classic",
        tagBg: "bg-amber-500/90",
        rating: 5,
        reviews: 156,
        weight: "500g Glass Jar",
        oldPrice: 299,
        price: 249,
        themeColor: "emerald"
    },
    {
        id: 3,
        category: "Achar",
        name: "Spicy Lemon Achar",
        image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=800&auto=format&fit=crop",
        tag: "Spiced",
        tagBg: "bg-yellow-500/90",
        rating: 4,
        reviews: 62,
        weight: "250g Glass Jar",
        oldPrice: 199,
        price: 169,
        themeColor: "emerald"
    },
    {
        id: 4,
        category: "Thekua",
        name: "Authentic Wheat Thekua",
        image: "https://images.unsplash.com/photo-1605085112728-3cdbb6241f2d?q=80&w=800&auto=format&fit=crop",
        tag: "Best Seller",
        tagBg: "bg-orange-500/90",
        rating: 5,
        reviews: 124,
        weight: "500g Traditional Pack",
        oldPrice: 249,
        price: 199,
        themeColor: "orange"
    },
    {
        id: 5,
        category: "Thekua",
        name: "Gud (Jaggery) Thekua",
        image: "https://images.unsplash.com/photo-1590080873952-4a85a06517da?q=80&w=800&auto=format&fit=crop",
        tag: "Specialty",
        tagBg: "bg-amber-600/90",
        rating: 4,
        reviews: 86,
        weight: "400g Artisanal Pack",
        oldPrice: 299,
        price: 249,
        themeColor: "orange"
    },
    {
        id: 6,
        category: "Thekua",
        name: "Mix Dry Fruit Thekua",
        image: "https://images.unsplash.com/photo-1599596395112-9dae07b8b2cb?q=80&w=800&auto=format&fit=crop",
        tag: "Premium",
        tagBg: "bg-rose-500/90",
        rating: 5,
        reviews: 42,
        weight: "400g Premium Pack",
        oldPrice: 399,
        price: 349,
        themeColor: "orange"
    }
];

const AllProducts = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Popularity");
    const [isSortOpen, setIsSortOpen] = useState(false);

    const categories = ["All", "Achar", "Thekua"];
    const sortOptions = ["Popularity", "Newest First", "Price: Low to High", "Price: High to Low"];

    const filteredProducts = allProductsData
        .filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === "Newest First") return b.id - a.id;
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            return 0; // Popularity (default)
        });

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 antialiased flex flex-col">

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1.5px] w-8 bg-primary shadow-[0_0_8px_rgba(236,109,19,0.3)]"></div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Our Collection</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            {selectedCategory === "All" ? "All Products" : selectedCategory}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest pb-2">
                        <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar / Filters */}
                    <aside className="lg:w-64 shrink-0 space-y-8">

                        {/* Categories */}
                        <div>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Categories</h3>
                                {selectedCategory !== "All" && (
                                    <button
                                        onClick={() => setSelectedCategory("All")}
                                        className="text-[10px] cursor-pointer font-black text-primary hover:opacity-80 transition-opacity"
                                    >
                                        CLEAR
                                    </button>
                                )}
                            </div>
                            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-3 cursor-pointer rounded-xl text-xs font-bold transition-all duration-300 ease-in-out text-left flex items-center justify-between border whitespace-nowrap shrink-0 ${selectedCategory === cat
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        <span className="mr-3">{cat}</span>
                                        <span className={`text-[10px] transition-opacity duration-300 ${selectedCategory === cat ? 'opacity-80' : 'opacity-40'}`}>
                                            {cat === "All" ? allProductsData.length : allProductsData.filter(p => p.category === cat).length}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sorting */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <SlidersHorizontal size={14} className="text-primary" />
                                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Sort By</h3>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className={`w-full cursor-pointer flex items-center justify-between bg-white dark:bg-slate-900 border ${isSortOpen ? 'border-primary' : 'border-slate-200 dark:border-slate-800'} rounded-xl px-5 py-4 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm hover:border-primary/40`}
                                >
                                    {sortBy}
                                    <div className={`text-slate-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-primary' : ''}`}>
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </button>

                                {isSortOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-30"
                                            onClick={() => setIsSortOpen(false)}
                                        />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSortBy(option);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`w-full cursor-pointer px-5 py-3.5 text-left text-xs font-bold transition-all ${sortBy === option
                                                        ? "bg-primary/5 text-primary"
                                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="flex justify-center">
                                        <ProductCard product={product} variant="horizontal-mobile" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                    <Search size={32} className="text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs">We couldn't find any products matching your search or category selection.</p>
                                <button
                                    onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                                    className="mt-6 text-primary text-xs font-bold uppercase tracking-widest border-b border-primary/20 hover:border-primary transition-all pb-1"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AllProducts;
