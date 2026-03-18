import { createSlice } from '@reduxjs/toolkit';
import { login, signup, logout, verifyOtp } from '../thunk/authThunk';
import { updateProfile } from '../thunk/userThunk';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const userData = action.payload.user || action.payload.data?.user || (action.payload.email || action.payload.name ? action.payload : null);
                const tokenData = action.payload.token || action.payload.access || action.payload.data?.token;
                const refreshTokenData = action.payload.refresh || action.payload.data?.refresh;

                state.user = userData;
                state.token = tokenData;
                state.refreshToken = refreshTokenData;

                if (tokenData) localStorage.setItem('token', tokenData);
                if (refreshTokenData) localStorage.setItem('refreshToken', refreshTokenData);
                if (userData) localStorage.setItem('user', JSON.stringify(userData));
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const userData = action.payload.user || action.payload.data?.user || (action.payload.email || action.payload.name ? action.payload : null);
                const tokenData = action.payload.token || action.payload.access || action.payload.data?.token;
                const refreshTokenData = action.payload.refresh || action.payload.data?.refresh;

                state.user = userData;
                state.token = tokenData;
                state.refreshToken = refreshTokenData;

                if (tokenData) localStorage.setItem('token', tokenData);
                if (refreshTokenData) localStorage.setItem('refreshToken', refreshTokenData);
                if (userData) localStorage.setItem('user', JSON.stringify(userData));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            })
            // Update Profile Sync
            .addCase(updateProfile.fulfilled, (state, action) => {
                const updatedUser = action.payload.user || action.payload.data || action.payload;
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            // OTP Verification Success
            .addCase(verifyOtp.fulfilled, (state) => {
                if (state.user) {
                    state.user.is_email_verified = true;
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
