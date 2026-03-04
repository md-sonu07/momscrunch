import { createSlice } from '@reduxjs/toolkit';
import { login, signup, logout } from '../thunk/authThunk';
import { updateProfile } from '../thunk/userThunk';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
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
                const userData = action.payload.user || action.payload.data?.user || action.payload;
                const tokenData = action.payload.token || action.payload.access || action.payload.data?.token;

                state.user = userData;
                state.token = tokenData;

                if (tokenData) localStorage.setItem('token', tokenData);
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
                const userData = action.payload.user || action.payload.data?.user || action.payload;
                const tokenData = action.payload.token || action.payload.access || action.payload.data?.token;

                state.user = userData;
                state.token = tokenData;

                if (tokenData) localStorage.setItem('token', tokenData);
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
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })
            // Update Profile Sync
            .addCase(updateProfile.fulfilled, (state, action) => {
                const updatedUser = action.payload.user || action.payload.data || action.payload;
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
