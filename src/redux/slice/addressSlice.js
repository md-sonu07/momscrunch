import { createSlice } from '@reduxjs/toolkit';
import { fetchAddresses, addAddress, editAddress, removeAddress, makeDefaultAddress } from '../thunk/addressThunk';

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload.data;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Address
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload.data);
                // If it was made default, other addresses are updated
                if (action.payload.data.isDefault) {
                    state.addresses.forEach(addr => {
                        if (addr._id !== action.payload.data._id) addr.isDefault = false;
                    });
                }
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Address
            .addCase(editAddress.fulfilled, (state, action) => {
                const index = state.addresses.findIndex(addr => addr._id === action.payload.data._id);
                if (index !== -1) state.addresses[index] = action.payload.data;
                if (action.payload.data.isDefault) {
                    state.addresses.forEach(addr => {
                        if (addr._id !== action.payload.data._id) addr.isDefault = false;
                    });
                }
            })
            // Remove Address
            .addCase(removeAddress.fulfilled, (state, action) => {
                state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
            })
            // Set Default
            .addCase(makeDefaultAddress.fulfilled, (state, action) => {
                state.addresses.forEach(addr => {
                    addr.isDefault = (addr._id === action.payload.data._id);
                });
            });
    },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
