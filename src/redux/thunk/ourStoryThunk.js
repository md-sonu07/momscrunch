import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOurStoryData } from '../../api/ourStory.api';

export const fetchOurStory = createAsyncThunk(
    'ourStory/fetchOurStory',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchOurStoryData();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || error.message || 'Failed to fetch Our Story');
        }
    }
);
