import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
    subCategories: [],
    skills: [],
    loading: false,
    error: null,

};

const taxonomySlice = createSlice({
    name: 'taxonomy',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSubCategories: (state, action) => {
            state.subCategories = action.payload;
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) state.categories[index] = { ...state.categories[index], ...action.payload };
        },
        deleteCategory: (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
            // Also clean up linked subcategories
            state.subCategories = state.subCategories.filter(s => s.categoryId !== action.payload);
        },
        addSubCategory: (state, action) => {
            state.subCategories.push(action.payload);
        },
        updateSubCategory: (state, action) => {
            const index = state.subCategories.findIndex(s => s.id === action.payload.id);
            if (index !== -1) state.subCategories[index] = { ...state.subCategories[index], ...action.payload };
        },
        deleteSubCategory: (state, action) => {
            state.subCategories = state.subCategories.filter(s => s.id !== action.payload);
            // Also clean up linked skills if subCategoryId exists in skills
            state.skills = state.skills.filter(sk => sk.subCategoryId !== action.payload);
        },
        addSkill: (state, action) => {
            state.skills.push(action.payload);
        },
        updateSkill: (state, action) => {
            const index = state.skills.findIndex(s => s.id === action.payload.id);
            if (index !== -1) state.skills[index] = { ...state.skills[index], ...action.payload };
        },
        deleteSkill: (state, action) => {
            state.skills = state.skills.filter(s => s.id !== action.payload);
        },
    },
});

export const {setCategories, setSubCategories,
    addCategory, updateCategory, deleteCategory,
    addSubCategory, updateSubCategory, deleteSubCategory,
    addSkill, updateSkill, deleteSkill
} = taxonomySlice.actions;
export default taxonomySlice.reducer;
