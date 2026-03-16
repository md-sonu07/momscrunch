import { createSlice } from '@reduxjs/toolkit';
import { fetchOurStory } from '../thunk/ourStoryThunk';

const ourStorySlice = createSlice({
    name: 'ourStory',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOurStory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOurStory.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchOurStory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ourStorySlice.reducer;
