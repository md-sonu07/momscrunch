import { createSlice } from '@reduxjs/toolkit';
import { getCategories, getSubCategories } from '../thunk/categoryThunk';

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
                state.categories = action.payload.data;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get SubCategories
            .addCase(getSubCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subCategories = action.payload.data;
            })
            .addCase(getSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
