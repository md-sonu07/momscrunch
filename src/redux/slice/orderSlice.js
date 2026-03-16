import { createSlice, createSelector } from '@reduxjs/toolkit';
import { fetchOrders } from '../thunk/orderThunk';

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setOrders, setCurrentOrder, setLoading, setError } = orderSlice.actions;

const selectOrderState = (state) => state.orders;

export const selectOrders = createSelector(
    [selectOrderState],
    (orderState) => orderState.orders
);

export const selectOrderCount = createSelector(
    [selectOrders],
    (orders) => orders.length
);

export default orderSlice.reducer;
