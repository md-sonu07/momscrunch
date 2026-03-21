import { createSlice } from '@reduxjs/toolkit';

const defaultLocation = {
    address: 'Select Location',
    city: 'Purnia',
    pincode: '854301',
    localArea: ''
};

// Load saved location from localStorage, falling back to defaults
const loadSavedLocation = () => {
    try {
        const saved = localStorage.getItem('userLocation');
        if (saved) {
            return { ...defaultLocation, ...JSON.parse(saved) };
        }
    } catch {
        // Corrupted data, ignore
    }
    return defaultLocation;
};

const initialState = {
    currentLocation: loadSavedLocation(),
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
            // Persist to localStorage
            try {
                localStorage.setItem('userLocation', JSON.stringify(state.currentLocation));
            } catch {
                // Storage full or unavailable, ignore
            }
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
