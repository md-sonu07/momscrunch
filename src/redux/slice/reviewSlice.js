import { createSlice } from '@reduxjs/toolkit';
import { getReviewsByProduct, postReview, removeReview } from '../thunk/reviewThunk';

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        submitting: false,
        deleting: null,
    },
    reducers: {
        clearReviewError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Reviews
            .addCase(getReviewsByProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReviewsByProduct.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload.results || action.payload;
                state.reviews = Array.isArray(data) ? data : [];
            })
            .addCase(getReviewsByProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Post Review
            .addCase(postReview.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(postReview.fulfilled, (state, action) => {
                state.submitting = false;
                state.reviews.unshift(action.payload);
            })
            .addCase(postReview.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            })
            // Delete Review
            .addCase(removeReview.pending, (state, action) => {
                state.deleting = action.meta.arg;
            })
            .addCase(removeReview.fulfilled, (state, action) => {
                state.deleting = null;
                state.reviews = state.reviews.filter(r => r.id !== action.payload);
            })
            .addCase(removeReview.rejected, (state) => {
                state.deleting = null;
            });
    },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
