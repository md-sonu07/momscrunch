import { createAsyncThunk } from '@reduxjs/toolkit';
import storeSettingsAPI from '../../api/store.api';

export const fetchStoreProfile = createAsyncThunk(
    'storeProfile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await storeSettingsAPI.getStoreProfile();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch store profile');
        }
    }
);
