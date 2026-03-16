import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCart as getCartApi,
    addToCart as addToCartApi,
    updateCartItem as updateCartItemApi,
    removeFromCart as removeFromCartApi,
    deleteCartItem as deleteCartItemApi,
    clearCart as clearCartApi,
} from '../../api/cart.api.js';

const getErrorMessage = (error, fallbackMessage) => (
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.response?.data?.error ||
    fallbackMessage
);

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            return await getCartApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to fetch cart'));
        }
    }
);

export const addItem = createAsyncThunk(
    'cart/addItem',
    async ({ variantId, quantity }, { rejectWithValue }) => {
        try {
            return await addToCartApi(variantId, quantity);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to add item to cart'));
        }
    }
);

export const removeItem = createAsyncThunk(
    'cart/removeItem',
    async (variantId, { rejectWithValue }) => {
        try {
            return await removeFromCartApi(variantId);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to remove item'));
        }
    }
);

export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            await updateCartItemApi(itemId, quantity);
            return await getCartApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to update quantity'));
        }
    }
);

export const deleteItem = createAsyncThunk(
    'cart/deleteItem',
    async (itemId, { rejectWithValue }) => {
        try {
            await deleteCartItemApi(itemId);
            return await getCartApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to delete item'));
        }
    }
);

export const emptyCart = createAsyncThunk(
    'cart/emptyCart',
    async (_, { rejectWithValue }) => {
        try {
            return await clearCartApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to clear cart'));
        }
    }
);
