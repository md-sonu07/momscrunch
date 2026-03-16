import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as loginApi, signupUser as signupApi, logoutUser as logoutApi, sendOtp as sendOtpApi, verifyOtp as verifyOtpApi } from '../../api/auth.api.js';

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await signupApi(userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed');
        }
    }
);

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async (registrationData, { rejectWithValue }) => {
        try {
            const data = await sendOtpApi(registrationData);
            return data;
        } catch (error) {
            let message = 'Failed to send OTP';
            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    message = data;
                } else if (data.message || data.error) {
                    message = data.message || data.error;
                } else {
                    // Extract first error from field-level errors object
                    const fieldErrors = Object.values(data);
                    if (fieldErrors.length > 0) {
                        message = Array.isArray(fieldErrors[0]) ? fieldErrors[0][0] : fieldErrors[0];
                    }
                }
            } else if (error.message) {
                message = error.message;
            }
            return rejectWithValue(message);
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
