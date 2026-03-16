import { createSlice } from '@reduxjs/toolkit';
import { fetchStoreProfile } from '../thunk/storeProfileThunk';

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const storeProfileSlice = createSlice({
    name: 'storeProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoreProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStoreProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchStoreProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default storeProfileSlice.reducer;
