import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as loginApi, signupUser as signupApi, logoutUser as logoutApi, resendOtp as resendOtpApi, verifyOtp as verifyOtpApi, forgotPassword as forgotPasswordApi, resetPassword as resetPasswordApi } from '../../api/auth.api.js';

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await signupApi(userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data?.email || 'Signup failed');
        }
    }
);

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (_, { rejectWithValue }) => {
        try {
            const data = await resendOtpApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to send OTP');
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (otpData, { rejectWithValue }) => {
        try {
            const data = await verifyOtpApi(otpData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await loginApi(userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const data = await logoutApi();
            return data;
        } catch (error) {
            console.error('Logout thunk error:', error);
            let errorMessage = 'Logout failed';

            if (error.response?.data) {
                const errorData = error.response.data;
                console.error('Error response data:', errorData);
                errorMessage = errorData.error || errorData.message || errorData.detail || 'Logout failed';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return rejectWithValue(errorMessage);
        }
    }
);
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const data = await forgotPasswordApi(email);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data?.email?.[0] || 'Reset request failed');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (resetData, { rejectWithValue }) => {
        try {
            const data = await resetPasswordApi(resetData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password reset failed');
        }
    }
);
