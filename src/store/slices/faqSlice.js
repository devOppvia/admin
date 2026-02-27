import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [
        { id: 1, question: 'How do I register as a company?', answer: 'Click on Register and fill the form.', category: 'General' },
        { id: 2, question: 'Is Oppvia free for interns?', answer: 'Yes, basic features are free.', category: 'Pricing' },
    ],
    categories: ['General', 'Pricing', 'Account', 'Technical'],
    loading: false,
    error: null,
};

const faqSlice = createSlice({
    name: 'faq',
    initialState,
    reducers: {
        addFaq: (state, action) => {
            state.items.push(action.payload);
        },
        updateFaq: (state, action) => {
            const index = state.items.findIndex(f => f.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
    },
});

export const { addFaq, updateFaq } = faqSlice.actions;
export default faqSlice.reducer;
