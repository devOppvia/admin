import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    packages: [],
    loading: false,
    error: null,
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setPackages: (state, action) => {
            state.packages = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addPackage: (state, action) => {
            const newPackage = {
                id: Date.now(),
                ...action.payload,
            };
            state.packages.push(newPackage);
        },
        updatePackage: (state, action) => {
            const index = state.packages.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.packages[index] = { ...state.packages[index], ...action.payload };
            }
        },
        deletePackage: (state, action) => {
            state.packages = state.packages.filter((p) => p.id !== action.payload);
        },
    },
});

export const { addPackage, updatePackage, deletePackage, setPackages, setLoading, setError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
