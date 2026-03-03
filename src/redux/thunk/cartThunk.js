import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCart as getCartApi,
    addToCart as addToCartApi,
    updateCartItem as updateCartItemApi,
    removeFromCart as removeFromCartApi,
    clearCart as clearCartApi
} from '../../api/cart.api.js';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getCartApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart');
        }
    }
);

export const addItem = createAsyncThunk(
    'cart/addItem',
    async (cartData, { rejectWithValue }) => {
        try {
            const data = await addToCartApi(cartData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to add item to cart');
        }
    }
);

export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const data = await updateCartItemApi(productId, quantity);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update quantity');
        }
    }
);

export const removeItem = createAsyncThunk(
    'cart/removeItem',
    async (productId, { rejectWithValue }) => {
        try {
            const data = await removeFromCartApi(productId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to remove item');
        }
    }
);

export const emptyCart = createAsyncThunk(
    'cart/emptyCart',
    async (_, { rejectWithValue }) => {
        try {
            const data = await clearCartApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to clear cart');
        }
    }
);
