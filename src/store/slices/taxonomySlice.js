import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [
        { id: 1, name: 'Web Development', subCategoriesCount: 5, createdAt: '2024-01-15T10:30:00Z' },
        { id: 2, name: 'Mobile App Development', subCategoriesCount: 3, createdAt: '2024-02-10T14:20:00Z' },
        { id: 3, name: 'Data Science', subCategoriesCount: 4, createdAt: '2024-03-05T09:15:00Z' },
    ],
    subCategories: [
        { id: 1, categoryId: 1, name: 'React.js', createdAt: '2024-01-16T11:00:00Z', categoryName: 'Web Development' },
        { id: 2, categoryId: 1, name: 'Node.js', createdAt: '2024-01-17T15:30:00Z', categoryName: 'Web Development' },
        { id: 3, categoryId: 2, name: 'Flutter', createdAt: '2024-02-11T16:45:00Z', categoryName: 'Mobile App Development' },
    ],
    skills: [
        { id: 1, subCategoryId: 1, name: 'Hooks' },
        { id: 2, subCategoryId: 1, name: 'Redux' },
        { id: 3, subCategoryId: 2, name: 'Express' },
    ],
    loading: false,
    error: null,
};

const taxonomySlice = createSlice({
    name: 'taxonomy',
    initialState,
    reducers: {
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

export const {
    addCategory, updateCategory, deleteCategory,
    addSubCategory, updateSubCategory, deleteSubCategory,
    addSkill, updateSkill, deleteSkill
} = taxonomySlice.actions;
export default taxonomySlice.reducer;
