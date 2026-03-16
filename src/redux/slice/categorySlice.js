import { createSlice } from '@reduxjs/toolkit';
import {
    getCategories,
    getCategoryDetail,
    addCategory,
    editCategory,
    removeCategory,
    getSubCategories,
    getSubCategoryDetail,
    addSubCategory,
    editSubCategory,
    removeSubCategory
} from '../thunk/categoryThunk';

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        subCategories: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Categories
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.results || action.payload.data || action.payload;
                state.categories = Array.isArray(data) ? data : [];
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Category
            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            // Edit Category
            .addCase(editCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            // Remove Category
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            })
            // Get SubCategories
            .addCase(getSubCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.results || action.payload.data || action.payload;
                state.subCategories = Array.isArray(data) ? data : [];
            })
            .addCase(getSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add SubCategory
            .addCase(addSubCategory.fulfilled, (state, action) => {
                state.subCategories.push(action.payload);
            })
            // Edit SubCategory
            .addCase(editSubCategory.fulfilled, (state, action) => {
                const index = state.subCategories.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.subCategories[index] = action.payload;
                }
            })
            // Remove SubCategory
            .addCase(removeSubCategory.fulfilled, (state, action) => {
                state.subCategories = state.subCategories.filter(s => s.id !== action.payload);
            });
    },

});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
