import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../redux/thunk/productThunk';
import { getCategories, getSubCategories } from '../../../redux/thunk/categoryThunk';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../../common/ProductCard';
import { Link } from 'react-router-dom';
import Skeleton from '../../common/Skeleton';

const ProductsWithCategory = () => {
    const dispatch = useDispatch();
    const { products, loading: productsLoading } = useSelector((state) => state.product);
    const { categories, subCategories, loading: categoriesLoading } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
        dispatch(getSubCategories());
    }, [dispatch]);

    // Theme color map for different categories to keep it vibrant
    const themeColors = ['emerald', 'orange', 'amber', 'rose'];

    if (productsLoading || categoriesLoading) {
        return (
            <div className="space-y-8">
                {[1, 2].map((i) => (
                    <section key={i} className="px-4 sm:px-6 py-12 max-w-7xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                            <div className="space-y-4 w-full md:w-1/2">
                                <Skeleton variant="text" width="80px" />
                                <Skeleton variant="title" width="60%" height="32px" />
                                <div className="flex gap-2">
                                    <Skeleton variant="text" width="60px" height="20px" className="rounded-full" />
                                    <Skeleton variant="text" width="60px" height="20px" className="rounded-full" />
                                    <Skeleton variant="text" width="60px" height="20px" className="rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="flex overflow-x-auto gap-8 pb-12 hide-scrollbar">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="min-w-[280px]">
                                    <Skeleton variant="rectangular" height="350px" className="rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        );
    }

    // Map each category to its associated products through subcategories
    const categorySections = categories.map((category, index) => {
        // Find subcategories that belong to this category
        const relevantSubCategories = subCategories
            .filter(sub => sub.category === category.id || sub.category_name === category.name);

        const relevantSubCategoryIds = relevantSubCategories.map(sub => sub.id);

        // Filter products that belong to any of these subcategories
        const categoryProducts = products.filter(p =>
            relevantSubCategoryIds.includes(p.subcategory) ||
            p.category === category.id ||
            p.category_name === category.name
        );

        return {
            ...category,
            subCategories: relevantSubCategories,
            products: categoryProducts.slice(0, 4),
            theme: themeColors[index % themeColors.length]
        };
    }).filter(section => section.products.length > 0);

    // If no dynamic categories/products, we can show a placeholder or nothing
    if (categorySections.length === 0) return null;

    return (
        <div className="space-y-4">
            {categorySections.map((section) => (
                <section key={section.id} id={section.slug || section.name?.toLowerCase().replace(/\s+/g, '-')} className="px-4 sm:px-6 py-12 scroll-mt-24 group/section">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 max-w-7xl mx-auto gap-6">
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`h-[1.5px] w-8 ${section.theme === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                                    section.theme === 'orange' ? 'bg-orange-500 shadow-[0_0_8_rgba(249,115,22,0.3)]' :
                                        section.theme === 'amber' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' :
                                            'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                                    }`}></div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${section.theme === 'emerald' ? 'text-emerald-600' :
                                    section.theme === 'orange' ? 'text-orange-600' :
                                        section.theme === 'amber' ? 'text-amber-600' :
                                            'text-rose-600'
                                    }`}>Our Selection</span>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{section.name}</h2>

                                {/* Subcategories list */}
                                <div className="flex flex-wrap gap-2">
                                    {section.subCategories.map(sub => (
                                        <Link
                                            key={sub.id}
                                            to={`/shop?category=${section.name}&subcategory=${sub.name}`}
                                            className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${section.theme === 'emerald' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/50' :
                                                section.theme === 'orange' ? 'text-orange-600 border-orange-100 bg-orange-50/50 hover:bg-orange-100/50' :
                                                    section.theme === 'amber' ? 'text-amber-600 border-amber-100 bg-amber-50/50 hover:bg-amber-100/50' :
                                                        'text-rose-600 border-rose-100 bg-rose-50/50 hover:bg-rose-100/50'
                                                }`}
                                        >
                                            {sub.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            {section.products.length < 4 ? '' : 'Newest Items'}
                        </div>
                    </div>

                    <div className="flex overflow-x-auto gap-8 pb-12 hide-scrollbar max-w-7xl mx-auto px-1">
                        {section.products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={{ ...product, themeColor: section.theme }}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link
                            to={`/shop?category=${section.name}`}
                            className={`group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] border-b transition-all pb-1 ${section.theme === 'emerald' ? 'text-emerald-600 border-emerald-500/20 hover:border-emerald-500' :
                                section.theme === 'orange' ? 'text-orange-600 border-orange-500/20 hover:border-orange-500' :
                                    section.theme === 'amber' ? 'text-amber-600 border-amber-100/20 hover:border-amber-500' :
                                        'text-rose-600 border-rose-100/10 hover:border-rose-500'
                                }`}
                        >
                            View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default ProductsWithCategory;