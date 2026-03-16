import React from 'react';
import PromoBanners from '../../components/userComponents/home/PromoBanners';
import StepToDoor from '../../components/userComponents/home/StepToDoor';
import ProductsWithCategory from '../../components/userComponents/home/ProductsWithCategory';

const Home = () => {

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
