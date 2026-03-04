import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductById, addProduct, editProduct, removeProduct } from '../thunk/productThunk';

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        product: null,
        loading: false,
        error: null,
        pagination: {},
    },
    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Products
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data || action.payload;
                state.pagination = action.payload.pagination || {};
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Single Product
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data || action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
