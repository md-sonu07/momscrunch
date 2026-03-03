import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slice/themeSlice';
import searchReducer from './slice/searchSlice';
import locationReducer from './slice/locationSlice';
import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice';
import productReducer from './slice/productSlice';
import categoryReducer from './slice/categorySlice';
import cartReducer from './slice/cartSlice';
import addressReducer from './slice/addressSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        search: searchReducer,
        location: locationReducer,
        auth: authReducer,
        user: userReducer,
        product: productReducer,
        category: categoryReducer,
        cart: cartReducer,
        address: addressReducer,
    },
});
