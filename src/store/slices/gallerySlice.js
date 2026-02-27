import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sliders: [
        { id: 1, imageUrl: 'https://via.placeholder.com/1200x400', title: 'Empowering future talent', active: true },
        { id: 2, imageUrl: 'https://via.placeholder.com/1200x400', title: 'Join our network', active: true },
    ],
    exhibitions: [
        { id: 1, title: 'Oppvia Tech Expo 2026', date: '2026-05-20', location: 'London' },
    ],
    loading: false,
    error: null,
};

const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {
        addSlider: (state, action) => {
            state.sliders.push(action.payload);
        },
        deleteSlider: (state, action) => {
            state.sliders = state.sliders.filter(s => s.id !== action.payload);
        },
    },
});

export const { addSlider, deleteSlider } = gallerySlice.actions;
export default gallerySlice.reducer;
