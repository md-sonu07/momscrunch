import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchCategories as fetchCategoriesApi,
    fetchSubCategories as fetchSubCategoriesApi,
    createCategory as createCategoryApi,
    updateCategory as updateCategoryApi,
    deleteCategory as deleteCategoryApi
} from '../../api/category.api.js';

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchCategoriesApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
        }
    }
);

export const getSubCategories = createAsyncThunk(
    'category/getSubCategories',
    async (categoryId, { rejectWithValue }) => {
        try {
            const data = await fetchSubCategoriesApi(categoryId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch sub-categories');
        }
    }
);

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const data = await createCategoryApi(categoryData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create category');
        }
    }
);

export const editCategory = createAsyncThunk(
    'category/editCategory',
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            const data = await updateCategoryApi(id, categoryData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update category');
        }
    }
);

export const removeCategory = createAsyncThunk(
    'category/removeCategory',
    async (id, { rejectWithValue }) => {
        try {
            await deleteCategoryApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete category');
        }
    }
);
