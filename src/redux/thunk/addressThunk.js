import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAddresses as getAddressesApi,
    createAddress as createAddressApi,
    updateAddress as updateAddressApi,
    deleteAddress as deleteAddressApi,
    setDefaultAddress as setDefaultAddressApi,
} from '../../api/address.api.js';

const getErrorMessage = (error, fallbackMessage) => (
    (() => {
        const data = error.response?.data;

        if (!data) {
            return fallbackMessage;
        }

        if (typeof data === 'string') {
            return data;
        }

        if (data.detail || data.message || data.error) {
            return data.detail || data.message || data.error;
        }

        const firstFieldError = Object.values(data).find((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
        if (Array.isArray(firstFieldError)) {
            return firstFieldError[0];
        }

        if (typeof firstFieldError === 'string') {
            return firstFieldError;
        }

        return fallbackMessage;
    })()
);

export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            return await getAddressesApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to fetch addresses'));
        }
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            return await createAddressApi(addressData);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to add address'));
        }
    }
);

export const editAddress = createAsyncThunk(
    'address/editAddress',
    async ({ id, addressData }, { rejectWithValue }) => {
        try {
            return await updateAddressApi(id, addressData);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to update address'));
        }
    }
);

export const removeAddress = createAsyncThunk(
    'address/removeAddress',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteAddressApi(id);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to delete address'));
        }
    }
);

export const makeDefaultAddress = createAsyncThunk(
    'address/makeDefaultAddress',
    async (id, { rejectWithValue }) => {
        try {
            return await setDefaultAddressApi(id);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Failed to set default address'));
        }
    }
);
