import { createSlice } from '@reduxjs/toolkit';

const normalizeNumber = (value, fallback) => {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const initialState = {
    gstPercentage: 18,
    deliveryCharge: 0,
    deliveryMode: 'local',
    freeShippingThreshold: 499,
    couponCode: '',
    loading: false,
    error: null,
    hasLoaded: false,
};

const storeSettingsSlice = createSlice({
    name: 'storeSettings',
    initialState,
    reducers: {
        setStoreSettings: (state, action) => {
            state.gstPercentage = normalizeNumber(action.payload.gst_percentage, 18);
            state.deliveryCharge = normalizeNumber(action.payload.delivery_charge, 0);
            state.deliveryMode = action.payload.delivery_mode ?? 'local';
            state.freeShippingThreshold = normalizeNumber(action.payload.free_shipping_threshold, 499);
            state.couponCode = action.payload.coupon_code ?? '';
            state.loading = false;
            state.error = null;
            state.hasLoaded = true;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
            state.error = null;
        },
        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { setStoreSettings, setLoading, setError } = storeSettingsSlice.actions;
export default storeSettingsSlice.reducer;
