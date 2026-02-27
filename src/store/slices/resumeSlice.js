import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [
        { id: 1, internName: 'Alice Smith', title: 'Fullstack Dev CV', status: 'VERIFIED', uploadedDate: '2026-02-15' },
        { id: 2, internName: 'Bob Johnson', title: 'Data Scientist Resume', status: 'PENDING', uploadedDate: '2026-02-28' },
    ],
    loading: false,
    error: null,
};

const resumeSlice = createSlice({
    name: 'resumes',
    initialState,
    reducers: {
        updateResumeStatus: (state, action) => {
            const { id, status } = action.payload;
            const resume = state.list.find(r => r.id === id);
            if (resume) {
                resume.status = status;
            }
        },
    },
});

export const { updateResumeStatus } = resumeSlice.actions;
export default resumeSlice.reducer;
