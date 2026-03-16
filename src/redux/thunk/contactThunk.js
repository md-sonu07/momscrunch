import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendContactMessage } from '../../api/contact.api';

export const submitContactMessage = createAsyncThunk(
    'contact/submitContactMessage',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await sendContactMessage(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message || 'Failed to send message');
        }
    }
);
