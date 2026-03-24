import { createSlice } from '@reduxjs/toolkit';

// Check localStorage for existing auth data on app load
const getStoredAuth = () => {
    const token = localStorage.getItem('accessToken');
    const adminData = localStorage.getItem('adminData');
    const userLoginId = localStorage.getItem('user-login-id');

    if (token && adminData && userLoginId) {
        return {
            user: JSON.parse(adminData),
            token: token,
            userLoginId: userLoginId,
            isAuthenticated: true,
        };
    }
    return null;
};

const storedAuth = getStoredAuth();

const initialState = storedAuth || {
    user: null,
    token: null,
    userLoginId: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.adminData;
            state.token = action.payload.accessToken;
            state.userLoginId = action.payload.adminData.id;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.userLoginId = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('adminData');
            localStorage.removeItem('user-login-id');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
