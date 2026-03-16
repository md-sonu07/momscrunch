import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchCategories as fetchCategoriesApi,
    fetchCategoryDetail as fetchCategoryDetailApi,
    fetchSubCategories as fetchSubCategoriesApi,
    fetchSubCategoryDetail as fetchSubCategoryDetailApi,
    createCategory as createCategoryApi,
    updateCategory as updateCategoryApi,
    patchCategory as patchCategoryApi,
    deleteCategory as deleteCategoryApi,
    createSubCategory as createSubCategoryApi,
    updateSubCategory as updateSubCategoryApi,
    deleteSubCategory as deleteSubCategoryApi
} from '../../api/category.api.js';

// Category Thunks
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

export const getCategoryDetail = createAsyncThunk(
    'category/getCategoryDetail',
    async (id, { rejectWithValue }) => {
        try {
            const data = await fetchCategoryDetailApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch category detail');
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
    async ({ id, categoryData, patch = false }, { rejectWithValue }) => {
        try {
            const data = patch
                ? await patchCategoryApi(id, categoryData)
                : await updateCategoryApi(id, categoryData);
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

// Subcategory Thunks
export const getSubCategories = createAsyncThunk(
    'category/getSubCategories',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchSubCategoriesApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch sub-categories');
        }
    }
);

export const getSubCategoryDetail = createAsyncThunk(
    'category/getSubCategoryDetail',
    async (id, { rejectWithValue }) => {
        try {
            const data = await fetchSubCategoryDetailApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch sub-category detail');
        }
    }
);

export const addSubCategory = createAsyncThunk(
    'category/addSubCategory',
    async (subCategoryData, { rejectWithValue }) => {
        try {
            const data = await createSubCategoryApi(subCategoryData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create sub-category');
        }
    }
);

export const editSubCategory = createAsyncThunk(
    'category/editSubCategory',
    async ({ id, subCategoryData }, { rejectWithValue }) => {
        try {
            const data = await updateSubCategoryApi(id, subCategoryData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update sub-category');
        }
    }
);

export const removeSubCategory = createAsyncThunk(
    'category/removeSubCategory',
    async (id, { rejectWithValue }) => {
        try {
            await deleteSubCategoryApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete sub-category');
        }
    }
);

