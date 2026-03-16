import { createSelector, createSlice } from '@reduxjs/toolkit';
import {
    fetchWishlist,
    addItemToWishlist,
    removeItemFromWishlist,
    deleteWishlistEntry,
    clearWishlistItems,
} from '../thunk/wishlistThunk';
import { logout } from '../thunk/authThunk';

const removePendingProductId = (state, productId) => {
    state.pendingProductIds = state.pendingProductIds.filter((id) => id !== productId);
};

const upsertWishlistItem = (items, wishlistItem) => {
    const existingIndex = items.findIndex((item) => item.id === wishlistItem.id);

    if (existingIndex >= 0) {
        items[existingIndex] = wishlistItem;
        return;
    }

    items.unshift(wishlistItem);
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
        error: null,
        hasLoaded: false,
        pendingProductIds: [],
    },
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.hasLoaded = true;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addItemToWishlist.pending, (state, action) => {
                state.error = null;
                state.pendingProductIds.push(action.meta.arg.productId);
            })
            .addCase(addItemToWishlist.fulfilled, (state, action) => {
                removePendingProductId(state, action.meta.arg.productId);
                state.hasLoaded = true;
                upsertWishlistItem(state.items, action.payload);
            })
            .addCase(addItemToWishlist.rejected, (state, action) => {
                removePendingProductId(state, action.meta.arg.productId);
                state.error = action.payload;
            })
            .addCase(removeItemFromWishlist.pending, (state, action) => {
                state.error = null;
                state.pendingProductIds.push(action.meta.arg.productId);
            })
            .addCase(removeItemFromWishlist.fulfilled, (state, action) => {
                removePendingProductId(state, action.meta.arg.productId);
                state.hasLoaded = true;
                state.items = action.payload;
            })
            .addCase(removeItemFromWishlist.rejected, (state, action) => {
                removePendingProductId(state, action.meta.arg.productId);
                state.error = action.payload;
            })
            .addCase(deleteWishlistEntry.pending, (state, action) => {
                state.error = null;
                state.pendingProductIds.push(action.meta.arg.productId);
            })
            .addCase(deleteWishlistEntry.fulfilled, (state, action) => {
                removePendingProductId(state, action.meta.arg.productId);
                state.hasLoaded = true;
                state.items = action.payload;
            })
            .addCase(deleteWishlistEntry.rejected, (state, action) => {
                removePendingProductId(state, action.meta.arg.productId);
                state.error = action.payload;
            })
            .addCase(clearWishlistItems.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(clearWishlistItems.fulfilled, (state, action) => {
                state.loading = false;
                state.hasLoaded = true;
                state.items = action.payload;
            })
            .addCase(clearWishlistItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.items = [];
                state.loading = false;
                state.error = null;
                state.hasLoaded = false;
                state.pendingProductIds = [];
            });
    },
});

export const { clearWishlistError } = wishlistSlice.actions;

const selectWishlistState = (state) => state.wishlist;

export const selectWishlistItems = createSelector(
    [selectWishlistState],
    (wishlistState) => wishlistState.items
);

export const selectWishlistCount = createSelector(
    [selectWishlistItems],
    (items) => items.length
);

export const selectWishlistLoading = createSelector(
    [selectWishlistState],
    (wishlistState) => wishlistState.loading
);

export const selectWishlistError = createSelector(
    [selectWishlistState],
    (wishlistState) => wishlistState.error
);

export const selectWishlistHasLoaded = createSelector(
    [selectWishlistState],
    (wishlistState) => wishlistState.hasLoaded
);

export const selectWishlistPendingProductIds = createSelector(
    [selectWishlistState],
    (wishlistState) => wishlistState.pendingProductIds
);

export const selectIsProductWishlisted = (productId) => createSelector(
    [selectWishlistItems],
    (items) => items.some((item) => item.product_id === productId)
);

export const selectWishlistItemByProductId = (productId) => createSelector(
    [selectWishlistItems],
    (items) => items.find((item) => item.product_id === productId) ?? null
);

export default wishlistSlice.reducer;
