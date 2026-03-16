import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    addedProduct: null,
};

const cartPopupSlice = createSlice({
    name: 'cartPopup',
    initialState,
    reducers: {
        showPopup: (state, action) => {
            state.isOpen = true;
            state.addedProduct = action.payload;
        },
        hidePopup: (state) => {
            state.isOpen = false;
            state.addedProduct = null;
        },
    },
});

export const { showPopup, hidePopup } = cartPopupSlice.actions;
export default cartPopupSlice.reducer;
