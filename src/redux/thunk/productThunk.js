import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchProducts as fetchProductsApi,
    fetchProductBySlug as fetchProductBySlugApi,
    createProduct as createProductApi,
    updateProduct as updateProductApi,
    deleteProduct as deleteProductApi
} from '../../api/product.api.js';

export const getProducts = createAsyncThunk(
    'product/getProducts',
    async (params, { rejectWithValue }) => {
        try {
            const data = await fetchProductsApi(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
        }
    }
);

export const getProductBySlug = createAsyncThunk(
    'product/getProductBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            const data = await fetchProductBySlugApi(slug);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
        }
    }
);

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const data = await createProductApi(productData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to add product');
        }
    }
);

export const editProduct = createAsyncThunk(
    'product/editProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const data = await updateProductApi(id, productData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update product');
        }
    }
);

export const removeProduct = createAsyncThunk(
    'product/removeProduct',
    async (id, { rejectWithValue }) => {
        try {
            await deleteProductApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete product');
        }
    }
);
