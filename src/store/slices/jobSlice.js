import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [
        {
            id: 1,
            jobTitle: 'Frontend Developer Intern',
            company: { companyName: 'TechCorp Solutions' },
            jobCategory: { categoryName: 'Web Development' },
            jobType: 'Full-Time',
            skills: ['React', 'Tailwind CSS', 'JavaScript'],
            location: 'Remote, UK',
            workingHours: '09:00 - 18:00',
            numberOfOpenings: 2,
            stipend: '£1,200',
            internshipDuration: '6 Months',
            score: 8.5,
            status: 'APPROVED',
            joinedDate: '2026-02-10'
        },
        {
            id: 2,
            jobTitle: 'Data Analyst Intern',
            company: { companyName: 'FinFlow Systems' },
            jobCategory: { categoryName: 'Data Science' },
            jobType: 'Part-Time',
            skills: ['Python', 'SQL', 'PowerBI'],
            location: 'London, UK',
            workingHours: '10:00 - 15:00',
            numberOfOpenings: 1,
            stipend: '£800',
            internshipDuration: '3 Months',
            score: 7.2,
            status: 'REVIEW',
            joinedDate: '2026-02-22'
        },
        {
            id: 3,
            jobTitle: 'Marketing Intern',
            company: { companyName: 'CreativeMinds' },
            jobCategory: { categoryName: 'Digital Marketing' },
            jobType: 'Full-Time',
            skills: ['SEO', 'Content Writing', 'Social Media'],
            location: 'Manchester, UK',
            workingHours: '09:00 - 17:00',
            numberOfOpenings: 3,
            stipend: '£1,000',
            internshipDuration: '4 Months',
            score: 9.0,
            status: 'APPROVED',
            joinedDate: '2026-02-15'
        },
        {
            id: 4,
            jobTitle: 'Machine Learning Engineer',
            company: { companyName: 'HealthBridge AI' },
            jobCategory: { categoryName: 'Artificial Intelligence' },
            jobType: 'Full-Time',
            skills: ['PyTorch', 'Computer Vision', 'NLP'],
            location: 'Remote',
            workingHours: '09:00 - 18:00',
            numberOfOpenings: 1,
            stipend: '£1,500',
            internshipDuration: '6 Months',
            score: 6.8,
            status: 'REVIEW',
            joinedDate: '2026-02-24'
        },
        {
            id: 5,
            jobTitle: 'Backend Developer',
            company: { companyName: 'CloudScale' },
            jobCategory: { categoryName: 'Backend Development' },
            jobType: 'Full-Time',
            skills: ['Node.js', 'PostgreSQL', 'Docker'],
            location: 'Birmingham, UK',
            workingHours: '09:00 - 18:00',
            numberOfOpenings: 2,
            stipend: '£1,300',
            internshipDuration: '6 Months',
            score: 4.5,
            status: 'REJECTED',
            joinedDate: '2026-02-20',
            rejectReason: 'Required skills don\'t match our current stack requirements.'
        },
        {
            id: 6,
            jobTitle: 'UI/UX Design Intern',
            company: { companyName: 'PixelPerfect' },
            jobCategory: { categoryName: 'Design' },
            jobType: 'Part-Time',
            skills: ['Figma', 'Adobe XD', 'Prototyping'],
            location: 'London, UK',
            workingHours: '13:00 - 17:00',
            numberOfOpenings: 1,
            stipend: '£700',
            internshipDuration: '3 Months',
            score: 8.8,
            status: 'PAUSED',
            joinedDate: '2026-02-18'
        },
    ],
    loading: false,
    error: null,
};

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        updateJobStatus: (state, action) => {
            const { id, status, rejectReason } = action.payload;
            const job = state.list.find(j => j.id === id);
            if (job) {
                job.status = status;
                if (rejectReason) job.rejectReason = rejectReason;
            }
        },
        deleteJob: (state, action) => {
            state.list = state.list.filter(j => j.id !== action.payload);
        },
        updateBulkJobStatus: (state, action) => {
            const { ids, status } = action.payload;
            state.list.forEach(job => {
                if (ids.includes(job.id)) {
                    job.status = status;
                }
            });
        },
    },
});

export const { updateJobStatus, deleteJob, updateBulkJobStatus } = jobSlice.actions;
export default jobSlice.reducer;
