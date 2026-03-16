import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchReviews, createReview } from '../../api/review.api';

export const getReviewsByProduct = createAsyncThunk(
    'review/getReviewsByProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const data = await fetchReviews({ product: productId });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch reviews');
        }
    }
);

export const postReview = createAsyncThunk(
    'review/postReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const data = await createReview(reviewData);
            return data;
        } catch (error) {
            const message = error.response?.data?.error ||
                error.response?.data?.message ||
                (error.response?.data && typeof error.response.data === 'object' ? Object.values(error.response.data)[0][0] : null) ||
                'Failed to post review';
            return rejectWithValue(message);
        }
    }
);
