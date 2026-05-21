import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [],
    isLoading: false,
    error: null,
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        // Fetch categories
        fetchStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchSuccess: (state, action) => {
            state.isLoading = false;
            state.categories = Array.isArray(action.payload) ? action.payload : [];
        },
        fetchFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Create category
        createSuccess: (state, action) => {
            state.categories.push(action.payload);
        },
        // Update category
        updateSuccess: (state, action) => {
            const index = state.categories.findIndex((c) => c._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        // Delete category
        deleteSuccess: (state, action) => {
            state.categories = state.categories.filter((c) => c._id !== action.payload);
        },
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    createSuccess,
    updateSuccess,
    deleteSuccess,
    clearError,
} = categorySlice.actions;

export default categorySlice.reducer;