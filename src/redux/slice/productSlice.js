import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductBySlug, addProduct, editProduct, removeProduct } from '../thunk/productThunk';

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
                const data = action.payload.results || action.payload.data || action.payload;
                state.products = Array.isArray(data) ? data : [];
                state.pagination = action.payload.pagination || {
                    count: action.payload.count,
                    next: action.payload.next,
                    previous: action.payload.previous
                };
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Single Product
            .addCase(getProductBySlug.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.data || action.payload;
            })
            .addCase(getProductBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
