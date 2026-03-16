import { createSlice, createSelector } from '@reduxjs/toolkit';
import { fetchCart, addItem, updateQuantity, removeItem, deleteItem, emptyCart } from '../thunk/cartThunk';
import { logout } from '../thunk/authThunk';

const applyCartPayload = (state, payload) => {
    state.loading = false;
    state.error = null;
    state.cart = payload;
};

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
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                applyCartPayload(state, action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItem.fulfilled, (state, action) => {
                applyCartPayload(state, action.payload);
            })
            .addCase(addItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                applyCartPayload(state, action.payload);
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                applyCartPayload(state, action.payload);
            })
            .addCase(removeItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                applyCartPayload(state, action.payload);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(emptyCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(emptyCart.fulfilled, (state, action) => {
                applyCartPayload(state, action.payload);
            })
            .addCase(emptyCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.cart = null;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { clearCartError } = cartSlice.actions;

// Memoized selectors to prevent unnecessary re-renders
const selectCartState = (state) => state.cart;

export const selectCart = createSelector(
    [selectCartState],
    (cartState) => cartState.cart
);

export const selectCartItems = createSelector(
    [selectCart],
    (cart) => cart?.items || []
);

export const selectCartItemCount = createSelector(
    [selectCartItems],
    (items) => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartLoading = createSelector(
    [selectCartState],
    (cartState) => cartState.loading
);

export const selectCartError = createSelector(
    [selectCartState],
    (cartState) => cartState.error
);

export default cartSlice.reducer;
