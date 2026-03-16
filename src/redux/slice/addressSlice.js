import { createSelector, createSlice } from '@reduxjs/toolkit';
import {
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
} from '../thunk/addressThunk';
import { logout } from '../thunk/authThunk';

const applyAddressList = (state, addresses) => {
    state.loading = false;
    state.error = null;
    state.hasLoaded = true;
    state.addresses = Array.isArray(addresses) ? addresses : [];
};

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        addresses: [],
        loading: false,
        error: null,
        hasLoaded: false,
    },
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                applyAddressList(state, action.payload);
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                applyAddressList(state, action.payload);
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editAddress.fulfilled, (state, action) => {
                applyAddressList(state, action.payload);
            })
            .addCase(editAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeAddress.fulfilled, (state, action) => {
                applyAddressList(state, action.payload);
            })
            .addCase(removeAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(makeDefaultAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(makeDefaultAddress.fulfilled, (state, action) => {
                applyAddressList(state, action.payload);
            })
            .addCase(makeDefaultAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.addresses = [];
                state.loading = false;
                state.error = null;
                state.hasLoaded = false;
            });
    },
});

export const { clearAddressError } = addressSlice.actions;

const selectAddressState = (state) => state.address;

export const selectAddresses = createSelector(
    [selectAddressState],
    (addressState) => addressState.addresses
);

export const selectAddressLoading = createSelector(
    [selectAddressState],
    (addressState) => addressState.loading
);

export const selectAddressError = createSelector(
    [selectAddressState],
    (addressState) => addressState.error
);

export const selectAddressHasLoaded = createSelector(
    [selectAddressState],
    (addressState) => addressState.hasLoaded
);

export const selectDefaultAddress = createSelector(
    [selectAddresses],
    (addresses) => addresses.find((address) => address.is_default) ?? addresses[0] ?? null
);

export default addressSlice.reducer;
