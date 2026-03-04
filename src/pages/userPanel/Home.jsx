import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllProducts, fetchAllCategories } from '../../redux/thunk/productThunk';
import PromoBanners from '../../components/userComponents/home/PromoBanners';
import StepToDoor from '../../components/userComponents/home/StepToDoor';
import ProductsWithCategory from '../../components/userComponents/home/ProductsWithCategory';

const Home = () => {
    // const dispatch = useDispatch();
    // const { products, categories, loading } = useSelector((state) => state.products);

    // useEffect(() => {
    //     dispatch(fetchAllProducts());
    //     dispatch(fetchAllCategories());
    // }, [dispatch]);

    // // Filtering products for Home sections
    // // Note: Adjust category filtering logic based on actual category names returned by your API
    // const acharProducts = products.filter(p =>
    //     p.subcategory_name?.toLowerCase().includes('achar') ||
    //     p.name?.toLowerCase().includes('achar')
    // ).slice(0, 4);

    // const thekuaProducts = products.filter(p =>
    //     p.subcategory_name?.toLowerCase().includes('thekua') ||
    //     p.name?.toLowerCase().includes('thekua')
    // ).slice(0, 4);

    return (
        <div className="max-w-7xl sm:px-10 mx-auto w-full py-8 space-y-12">
            {/* Dynamically Rendered Promo Banners */}
            <PromoBanners />

            <div className="max-w-7xl mx-auto space-y-12">
                <ProductsWithCategory />
                <StepToDoor />
            </div>
        </div>
    );
};

export default Home;
