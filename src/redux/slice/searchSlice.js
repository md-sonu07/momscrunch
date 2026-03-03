import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        isOpen: false,
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        toggleSearch: (state) => {
            state.isOpen = !state.isOpen;
        },
        openSearch: (state) => {
            state.isOpen = true;
        },
        closeSearch: (state) => {
            state.isOpen = false;
            state.query = '';
        },
    },
});

export const { setSearchQuery, toggleSearch, openSearch, closeSearch } = searchSlice.actions;
export default searchSlice.reducer;
