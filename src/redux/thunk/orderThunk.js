import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrders } from '../../api/order.api.js';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getOrders();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);
