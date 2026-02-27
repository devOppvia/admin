import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stats: {
        totalCompanies: 154,
        pendingCompanies: 12,
        totalJobs: 842,
        activeJobs: 650,
        totalInterns: 12450,
        newApplications: 45,
        totalRevenue: '$12,450',
    },
    recentActivity: [
        { id: 1, type: 'COMPANY_REGISTRATION', entity: 'TechCorp Solutions', time: '2 hours ago', status: 'PENDING' },
        { id: 2, type: 'JOB_POSTING', entity: 'UI/UX Designer at CreativeMinds', time: '4 hours ago', status: 'APPROVED' },
        { id: 3, type: 'RESUME_UPLOAD', entity: 'John Doe', time: '5 hours ago', status: 'NEW' },
    ],
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setStats: (state, action) => {
            state.stats = action.payload;
        },
    },
});

export const { setStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
