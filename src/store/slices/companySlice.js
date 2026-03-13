import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { changeCompanyStatusApi, getAllRegisteredCompanysApi } from '../../helper/api_helper';

// Async thunk for fetching companies
export const fetchCompanies = createAsyncThunk(
    'companies/fetchCompanies',
    async (status, { rejectWithValue }) => {
        try {
            const response = await getAllRegisteredCompanysApi(status);
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch companies');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch companies');
        }
    }
);

export const updateCompanyStatus = createAsyncThunk(
    'companies/updateCompanyStatus',
    async ({ id, status , reason}, { rejectWithValue }) => {
        try {
            const response = await changeCompanyStatusApi(id, status , reason);
            if (response.status) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to update company status');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update company status');
        }
    }
)

const initialState = {
    list: [],
    loading: false,
    error: null,
};

const companySlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        deleteCompany: (state, action) => {
            state.list = state.list.filter(c => c.id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {  deleteCompany, clearError } = companySlice.actions;
export default companySlice.reducer;
