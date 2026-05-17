import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transactions: [],
    currentTransaction: null,
    isLoading: false,
    error: null,
    filters: {
        type: null,
        category: null,
        startDate: null,
        endDate: null,
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        // Fetch transactions
        fetchStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchSuccess: (state, action) => {
            state.isLoading = false;
            state.transactions = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        fetchFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Create transaction
        createSuccess: (state, action) => {
            state.transactions.unshift(action.payload);
        },
        // Update transaction
        updateSuccess: (state, action) => {
            const index = state.transactions.findIndex((t) => t._id === action.payload._id);
            if (index !== -1) {
                state.transactions[index] = action.payload;
            }
        },
        // Delete transaction
        deleteSuccess: (state, action) => {
            state.transactions = state.transactions.filter((t) => t._id !== action.payload);
        },
        // Set filters
        setFilters: (state, action) => {
            state.filters = action.payload;
            state.pagination.page = 1;
        },
        // Set pagination
        setPagination: (state, action) => {
            state.pagination.page = action.payload;
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
    setFilters,
    setPagination,
    clearError,
} = transactionSlice.actions;

export default transactionSlice.reducer;