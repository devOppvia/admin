import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [
        {
            id: 1,
            title: 'Future of Internships in 2026',
            author: 'Admin',
            category: 'Education',
            status: 'PUBLISHED',
            date: '2026-02-10',
            image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop',
            description: '<p>The landscape of internships is changing rapidly with AI. In this article, we explore the upcoming trends for 2026...</p>',
            excerpt: 'How AI and remote work are shaping the future of early career development.',
            isFeatured: true,
            slug: 'future-of-internships-2026',
            metaTitle: 'The Future of Internships: AI and Beyond | Oppvia Blog',
            metaDescription: 'Discover how AI and remote work are revolutionizing the internship landscape in 2026.',
            altTag: 'Students working with AI tools'
        },
        {
            id: 2,
            title: 'Top 10 Skills for UI Designers',
            author: 'Editor',
            category: 'Design',
            status: 'DRAFT',
            date: '2026-02-25',
            image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1470&auto=format&fit=crop',
            description: '<p>Designers need more than just tools in 2026. Empathy and system thinking are becoming crucial...</p>',
            excerpt: 'Beyond Figma: The soft skills that will define the next generation of designers.',
            isFeatured: false,
            slug: 'top-10-ui-designer-skills',
            metaTitle: 'Top 10 Essential Skills for UI Designers in 2026',
            metaDescription: 'Master the soft and hard skills needed to excel as a UI designer in the modern era.',
            altTag: 'Designer sketching interface patterns',
            isScheduled: true,
            scheduledDate: '2026-03-01T10:00:00Z'
        },
        {
            id: 3,
            title: 'Transitioning from Code to Product',
            author: 'Admin',
            category: 'Career Advice',
            status: 'PUBLISHED',
            date: '2026-01-15',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop',
            description: '<p>Making the leap from developer to product manager is a common goal for many. Here is our roadmap...</p>',
            excerpt: 'A comprehensive guide for engineers looking to broaden their impact through product management.',
            isFeatured: false
        },
    ],
    categories: ['Education', 'Technology', 'Design', 'Career Advice', 'News'],
    tags: ['Career', 'Remote', 'UI/UX', 'Coding', 'Product'],
    loading: false,
    error: null,
};

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.posts[index] = { ...state.posts[index], ...action.payload };
            }
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter(p => p.id !== action.payload);
        },
    },
});

export const { addPost, updatePost, deletePost } = blogSlice.actions;
export default blogSlice.reducer;
