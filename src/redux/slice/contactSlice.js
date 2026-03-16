import { createSlice } from '@reduxjs/toolkit';
import { submitContactMessage } from '../thunk/contactThunk';

const initialState = {
    loading: false,
    success: false,
    error: null,
    response: null,
};

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        resetContactState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.response = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitContactMessage.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitContactMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.response = action.payload;
            })
            .addCase(submitContactMessage.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;
