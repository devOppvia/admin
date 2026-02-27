import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import companyReducer from './slices/companySlice';
import jobReducer from './slices/jobSlice';
import taxonomyReducer from './slices/taxonomySlice';
import blogReducer from './slices/blogSlice';
import galleryReducer from './slices/gallerySlice';
import faqReducer from './slices/faqSlice';
import resumeReducer from './slices/resumeSlice';
import supportReducer from './slices/supportSlice';
import subscriptionReducer from './slices/subscriptionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        companies: companyReducer,
        jobs: jobReducer,
        taxonomy: taxonomyReducer,
        blogs: blogReducer,
        gallery: galleryReducer,
        faq: faqReducer,
        resumes: resumeReducer,
        support: supportReducer,
        subscription: subscriptionReducer,
    },
});
