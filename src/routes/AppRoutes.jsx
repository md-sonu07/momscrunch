import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/userPanel/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Shop from '../pages/userPanel/Shop';
import OurStory from '../pages/userPanel/OurStory';
import Contact from '../pages/userPanel/Contact';
import Profile from '../pages/userPanel/Profile';
import Cart from '../pages/userPanel/Cart';
import ActiveOrders from '../pages/userPanel/ActiveOrders';
import Wishlist from '../pages/userPanel/Wishlist';
import Addresses from '../pages/userPanel/Addresses';
import Settings from '../pages/userPanel/Settings';
import Checkout from '../pages/userPanel/Checkout';

import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/cart" element={<Cart />} />
                <Route path="/profile/orders" element={<ActiveOrders />} />
                <Route path="/profile/wishlist" element={<Wishlist />} />
                <Route path="/profile/addresses" element={<Addresses />} />
                <Route path="/profile/settings" element={<Settings />} />
                <Route path="/checkout" element={<Checkout />} />
            </Route>

        </Routes>
    );
};

export default AppRoutes;
