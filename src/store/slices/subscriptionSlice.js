import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    packages: [
        {
            id: 1,
            packageName: "Basic Plan",
            actualPrice: 1000,
            discountedPrice: 800,
            numberOfJobPosting: 5,
            numberOfResumeAccess: 50,
            jobDaysActive: 30,
            expireDaysPackage: 30,
            sortDescription: "Ideal for small businesses starting out."
        },
        {
            id: 2,
            packageName: "Pro Plan",
            actualPrice: 2500,
            discountedPrice: 2000,
            numberOfJobPosting: 20,
            numberOfResumeAccess: 200,
            jobDaysActive: 60,
            expireDaysPackage: 90,
            sortDescription: "Perfect for growing companies hiring regularly."
        },
        {
            id: 3,
            packageName: "Premium Enterprise",
            actualPrice: 5000,
            discountedPrice: 4000,
            numberOfJobPosting: 50,
            numberOfResumeAccess: 1000,
            jobDaysActive: 90,
            expireDaysPackage: 365,
            sortDescription: "Comprehensive solution for large-scale operations."
        }
    ]
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
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

export const { addPackage, updatePackage, deletePackage } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
