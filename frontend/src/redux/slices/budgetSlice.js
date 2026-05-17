import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    budgets: [],
    budgetStatus: null,
    isLoading: false,
    error: null,
};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        // Fetch budgets
        fetchStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchSuccess: (state, action) => {
            state.isLoading = false;
            state.budgets = action.payload;
        },
        fetchFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Fetch budget status
        fetchStatusSuccess: (state, action) => {
            state.budgetStatus = action.payload;
        },
        // Create budget
        createSuccess: (state, action) => {
            state.budgets.push(action.payload);
        },
        // Update budget
        updateSuccess: (state, action) => {
            const index = state.budgets.findIndex((b) => b._id === action.payload._id);
            if (index !== -1) {
                state.budgets[index] = action.payload;
            }
        },
        // Delete budget
        deleteSuccess: (state, action) => {
            state.budgets = state.budgets.filter((b) => b._id !== action.payload);
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
    fetchStatusSuccess,
    createSuccess,
    updateSuccess,
    deleteSuccess,
    clearError,
} = budgetSlice.actions;

export default budgetSlice.reducer;