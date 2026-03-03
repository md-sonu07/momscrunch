import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfile, updateProfile as updateProfileApi, changePassword as changePasswordApi } from '../../api/user.api.js';

export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getUserProfile();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const data = await updateProfileApi(profileData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const data = await changePasswordApi(passwordData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change password');
        }
    }
);
