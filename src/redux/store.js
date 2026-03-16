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
import storeSettingsReducer from './slice/storeSettingsSlice';
import wishlistReducer from './slice/wishlistSlice';
import orderReducer from './slice/orderSlice';

import cartPopupReducer from './slice/cartPopupSlice';
import ourStoryReducer from './slice/ourStorySlice';
import storeProfileReducer from './slice/storeProfileSlice';
import contactReducer from './slice/contactSlice';

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
        wishlist: wishlistReducer,
        address: addressReducer,
        orders: orderReducer,
        storeSettings: storeSettingsReducer,
        cartPopup: cartPopupReducer,
        ourStory: ourStoryReducer,
        storeProfile: storeProfileReducer,
        contact: contactReducer,
    },
});
