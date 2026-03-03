import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addItem, updateQuantity, removeItem, emptyCart } from '../thunk/cartThunk';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Item
            .addCase(addItem.pending, (state) => {
                state.loading = true;
            })
            .addCase(addItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
            })
            .addCase(addItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Quantity
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.cart = action.payload.data;
            })
            // Remove Item
            .addCase(removeItem.fulfilled, (state, action) => {
                state.cart = action.payload.data;
            })
            // Empty Cart
            .addCase(emptyCart.fulfilled, (state, action) => {
                state.cart = action.payload.data;
            });
    },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
