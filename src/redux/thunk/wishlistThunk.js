import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getWishlist as getWishlistApi,
    addWishlistItem as addWishlistItemApi,
    removeWishlistItem as removeWishlistItemApi,
    deleteWishlistItem as deleteWishlistItemApi,
    clearWishlist as clearWishlistApi,
} from '../../api/wishlist.api.js';

const getErrorMessage = (error, fallbackMessage) => (
    error.response?.data?.detail ||
    error.response?.data?.message ||
    error.response?.data?.error ||
    fallbackMessage
);

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            return await getWishlistApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to fetch wishlist'));
        }
    },
    {
        condition: (arg, { getState }) => {
            const { wishlist } = getState();
            return Boolean(arg?.force) || (!wishlist.loading && !wishlist.hasLoaded);
        },
    }
);

export const addItemToWishlist = createAsyncThunk(
    'wishlist/addItemToWishlist',
    async ({ variantId }, { rejectWithValue }) => {
        try {
            return await addWishlistItemApi(variantId);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to add item to wishlist'));
        }
    }
);

export const removeItemFromWishlist = createAsyncThunk(
    'wishlist/removeItemFromWishlist',
    async ({ variantId }, { rejectWithValue }) => {
        try {
            return await removeWishlistItemApi(variantId);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to remove item from wishlist'));
        }
    }
);

export const deleteWishlistEntry = createAsyncThunk(
    'wishlist/deleteWishlistEntry',
    async ({ itemId }, { rejectWithValue }) => {
        try {
            return await deleteWishlistItemApi(itemId);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to delete wishlist item'));
        }
    }
);

export const clearWishlistItems = createAsyncThunk(
    'wishlist/clearWishlistItems',
    async (_, { rejectWithValue }) => {
        try {
            return await clearWishlistApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to clear wishlist'));
        }
    }
);
