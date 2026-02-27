import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [
        {
            id: 1,
            name: 'TechCorp Solutions',
            email: 'hr@techcorp.com',
            industry: 'Software',
            status: 'APPROVED',
            joinedDate: '2026-01-15',
            contactName: 'John Doe',
            designation: 'HR Director',
            phone: '+1 (555) 123-4567',
            companySize: '500-1000',
            website: 'https://techcorp.solutions',
            description: 'TechCorp is a leading provider of innovative software solutions, specializing in cloud infrastructure and enterprise applications. Our mission is to empower businesses through technology.',
            address: '123 Innovation Drive',
            city: 'San Francisco',
            state: 'California',
            zipCode: '94103',
            country: 'USA',
            linkedin: 'linkedin.com/company/techcorp',
            instagram: '@techcorp_global',
            youtube: 'youtube.com/techcorp'
        },
        {
            id: 2,
            name: 'EcoGen Dynamics',
            email: 'contact@ecogen.io',
            industry: 'Renewable Energy',
            status: 'PENDING',
            joinedDate: '2026-02-20',
            contactName: 'Sarah Green',
            designation: 'Founder & CEO',
            phone: '+44 20 7946 0000',
            companySize: '50-200',
            website: 'https://ecogen.io',
            description: 'EcoGen Dynamics is committed to revolutionizing the renewable energy sector through sustainable and efficient energy generation technologies.',
            address: '45 Green Street',
            city: 'London',
            state: 'Greater London',
            zipCode: 'EC1A 1BB',
            country: 'United Kingdom',
            linkedin: 'linkedin.com/company/ecogen',
            instagram: '@ecogen_eco',
            youtube: 'youtube.com/ecogen'
        },
        {
            id: 3,
            name: 'FinFlow Systems',
            email: 'info@finflow.com',
            industry: 'Fintech',
            status: 'REJECTED',
            joinedDate: '2026-02-10',
            contactName: 'Michael Chen',
            designation: 'Operations Lead',
            phone: '+852 2345 6789',
            companySize: '200-500',
            website: 'https://finflow.com',
            description: 'FinFlow Systems provides seamless financial transaction platforms for the modern digital economy.',
            address: '88 Finance Tower',
            city: 'Central',
            state: 'Hong Kong Island',
            zipCode: '0000',
            country: 'Hong Kong',
            linkedin: 'linkedin.com/company/finflow',
            instagram: '@finflow_fintech',
            youtube: 'youtube.com/finflow'
        },
        {
            id: 4,
            name: 'HealthBridge AI',
            email: 'careers@healthbridge.ai',
            industry: 'Healthcare',
            status: 'PENDING',
            joinedDate: '2026-02-25',
            contactName: 'Dr. Emily Watson',
            designation: 'Chief Medical Officer',
            phone: '+61 2 9385 0000',
            companySize: '100-250',
            website: 'https://healthbridge.ai',
            description: 'HealthBridge AI leverages artificial intelligence to bridge the gap between healthcare data and actionable clinical insights.',
            address: 'Sydney Medical Park',
            city: 'Sydney',
            state: 'NSW',
            zipCode: '2000',
            country: 'Australia',
            linkedin: 'linkedin.com/company/healthbridge',
            instagram: '@healthbridge_ai',
            youtube: 'youtube.com/healthbridge'
        },
    ],
    loading: false,
    error: null,
};

const companySlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        updateCompanyStatus: (state, action) => {
            const { id, status } = action.payload;
            const company = state.list.find(c => c.id === id);
            if (company) {
                company.status = status;
            }
        },
        deleteCompany: (state, action) => {
            state.list = state.list.filter(c => c.id !== action.payload);
        },
    },
});

export const { updateCompanyStatus, deleteCompany } = companySlice.actions;
export default companySlice.reducer;
