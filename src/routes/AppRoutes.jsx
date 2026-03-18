import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/userPanel/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Shop from '../pages/userPanel/Shop';
import OurStory from '../pages/userPanel/OurStory';
import Contact from '../pages/userPanel/Contact';
import Profile from '../pages/userPanel/Profile';
import Cart from '../pages/userPanel/Cart';
import ActiveOrders from '../pages/userPanel/ActiveOrders';
import OrderDetail from '../pages/userPanel/OrderDetail';
import Wishlist from '../pages/userPanel/Wishlist';
import Addresses from '../pages/userPanel/Addresses';
import Settings from '../pages/userPanel/Settings';
import Wallet from '../pages/userPanel/Wallet';
import Checkout from '../pages/userPanel/Checkout';
import ProductDetail from '../pages/userPanel/ProductDetail';
import TermsAndConditions from '../pages/userPanel/TermsAndConditions';
import NotFound from '../pages/userPanel/NotFound';

import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/cart" element={<Cart />} />
                <Route path="/profile/orders" element={<ActiveOrders />} />
                <Route path="/profile/orders/:id" element={<OrderDetail />} />
                <Route path="/profile/wishlist" element={<Wishlist />} />
                <Route path="/profile/addresses" element={<Addresses />} />
                <Route path="/profile/settings" element={<Settings />} />
                <Route path="/profile/wallet" element={<Wallet />} />
                <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
