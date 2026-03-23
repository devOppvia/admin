import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllBlogsApi, deleteBlogsApi, createBlogCategoryApi, updateBlogCategoryApi, getBlogCategoriesApi, deleteBlogcategoryApi, createBlogTagsApi, updateBlogTagsApi, getBlogTagsApi, deleteBlogTagsApi } from '../../helper/api_helper';
import toast from 'react-hot-toast';

// Async thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
    'blogs/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getBlogCategoriesApi();
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch categories');
            }
        } catch (error) {
            toast.error(error || 'Failed to fetch categories');
            return rejectWithValue(error.message || 'Failed to fetch categories');
        }
    }
);

// Async thunk for creating a category
export const createCategory = createAsyncThunk(
    'blogs/createCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await createBlogCategoryApi(categoryData);
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to create category');
            }
        } catch (error) {
            toast.error(error || 'Failed to fetch categories');
            return rejectWithValue(error || 'Failed to create category');
        }
    }
);

// Async thunk for updating a category
export const updateCategoryAsync = createAsyncThunk(
    'blogs/updateCategoryAsync',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await updateBlogCategoryApi(categoryData);
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to update category');
            }
        } catch (error) {
                        toast.error(error || 'Failed to fetch categories');

            return rejectWithValue(error || 'Failed to update category');
        }
    }
);

// Async thunk for deleting a category
export const deleteCategoryAsync = createAsyncThunk(
    'blogs/deleteCategoryAsync',
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteBlogcategoryApi({ id });
            if (response.status) {
                return id;
            } else {
                return rejectWithValue(response.message || 'Failed to delete category');
            }
        } catch (error) {
                        toast.error(error || 'Failed to fetch categories');

            return rejectWithValue(error       || 'Failed to delete category');
        }
    }
);

// Async thunk for fetching all tags
export const fetchTags = createAsyncThunk(
    'blogs/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getBlogTagsApi();
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch tags');
            }
        } catch (error) {
            return rejectWithValue(error || 'Failed to fetch tags');
        }
    }
);

// Async thunk for creating a tag
export const createTag = createAsyncThunk(
    'blogs/createTag',
    async (tagData, { rejectWithValue }) => {
        try {
            const response = await createBlogTagsApi(tagData);
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to create tag');
            }
        } catch (error) {
                                    toast.error(error || 'Failed to fetch categories');

            return rejectWithValue(error || 'Failed to create tag');
        }
    }
);

// Async thunk for updating a tag
export const updateTagAsync = createAsyncThunk(
    'blogs/updateTagAsync',
    async (tagData, { rejectWithValue }) => {
        try {
            const response = await updateBlogTagsApi(tagData);
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to update tag');
            }
        } catch (error) {
                                    toast.error(error || 'Failed to fetch categories');

            return rejectWithValue(error || 'Failed to update tag');
        }
    }
);

// Async thunk for deleting a tag
export const deleteTagAsync = createAsyncThunk(
    'blogs/deleteTagAsync',
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteBlogTagsApi({ id });
            if (response.status) {
                return id;
            } else {
                return rejectWithValue(response.message || 'Failed to delete tag');
            }
        } catch (error) {
                                    toast.error(error || 'Failed to fetch categories');

            return rejectWithValue(error || 'Failed to delete tag');
        }
    }
);

// Async thunk for fetching all blogs
export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await getAllBlogsApi(userData);
            if (response.status) {
                return response.data.blogs;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch blogs');
            }
        } catch (error) {
                                    toast.error(error || 'Failed to fetch categories');

            return rejectWithValue(error || 'Failed to fetch blogs');
        }
    }
);

// Async thunk for deleting a blog
export const deleteBlog = createAsyncThunk(
    'blogs/deleteBlog',
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteBlogsApi({ id });
            if (response.status) {
                return id;
            } else {
                return rejectWithValue(response.message || 'Failed to delete blog');
            }
        } catch (error) {
                                    toast.error(error || 'Failed to fetch categories');

            return rejectWithValue(error || 'Failed to delete blog');
        }
    }
);

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
        // Category CRUD
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(c => c === action.payload.oldName);
            if (index !== -1) {
                state.categories[index] = action.payload.newName;
            }
        },
        deleteCategory: (state, action) => {
            state.categories = state.categories.filter(c => c !== action.payload);
        },
        // Tag CRUD
        addTag: (state, action) => {
            state.tags.push(action.payload);
        },
        updateTag: (state, action) => {
            const index = state.tags.findIndex(t => t === action.payload.oldName);
            if (index !== -1) {
                state.tags[index] = action.payload.newName;
            }
        },
        deleteTag: (state, action) => {
            state.tags = state.tags.filter(t => t !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch blogs
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete blog
            .addCase(deleteBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.filter(p => p.id !== action.payload);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create category
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            // Update category
            .addCase(updateCategoryAsync.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            // Delete category
            .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            })
            // Fetch tags
            .addCase(fetchTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create tag
            .addCase(createTag.fulfilled, (state, action) => {
                state.tags.push(action.payload);
            })
            // Update tag
            .addCase(updateTagAsync.fulfilled, (state, action) => {
                const index = state.tags.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tags[index] = action.payload;
                }
            })
            // Delete tag
            .addCase(deleteTagAsync.fulfilled, (state, action) => {
                state.tags = state.tags.filter(t => t.id !== action.payload);
            });
    },
});

export const { addPost, updatePost, deletePost, addCategory, updateCategory, deleteCategory, addTag, updateTag, deleteTag } = blogSlice.actions;
export default blogSlice.reducer;
