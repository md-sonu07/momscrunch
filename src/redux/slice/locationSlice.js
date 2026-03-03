import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentLocation: {
        address: 'Select Location',
        city: 'Purnia',
        pincode: '854301',
        localArea: ''
    },
    savedAddresses: []
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            state.currentLocation = {
                ...state.currentLocation,
                ...action.payload
            };
        },
        setSavedAddresses: (state, action) => {
            state.savedAddresses = action.payload;
        },
        addAddress: (state, action) => {
            state.savedAddresses.push(action.payload);
        }
    }
});

export const { setLocation, setSavedAddresses, addAddress } = locationSlice.actions;
export default locationSlice.reducer;
