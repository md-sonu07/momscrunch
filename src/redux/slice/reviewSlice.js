import { createSlice } from '@reduxjs/toolkit';
import { getReviewsByProduct, postReview } from '../thunk/reviewThunk';

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        submitting: false,
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
            });
    },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
