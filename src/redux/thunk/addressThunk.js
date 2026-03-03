import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAddresses as getAddressesApi,
    createAddress as createAddressApi,
    updateAddress as updateAddressApi,
    deleteAddress as deleteAddressApi,
    setDefaultAddress as setDefaultAddressApi
} from '../../api/address.api.js';

export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAddressesApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch addresses');
        }
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const data = await createAddressApi(addressData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to add address');
        }
    }
);

export const editAddress = createAsyncThunk(
    'address/editAddress',
    async ({ id, addressData }, { rejectWithValue }) => {
        try {
            const data = await updateAddressApi(id, addressData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update address');
        }
    }
);

export const removeAddress = createAsyncThunk(
    'address/removeAddress',
    async (id, { rejectWithValue }) => {
        try {
            await deleteAddressApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete address');
        }
    }
);

export const makeDefaultAddress = createAsyncThunk(
    'address/makeDefaultAddress',
    async (id, { rejectWithValue }) => {
        try {
            const data = await setDefaultAddressApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to set default address');
        }
    }
);
