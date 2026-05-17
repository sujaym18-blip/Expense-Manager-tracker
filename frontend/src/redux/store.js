import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transactionReducer from './slices/transactionSlice';
import categoryReducer from './slices/categorySlice';
import budgetReducer from './slices/budgetSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transaction: transactionReducer,
        category: categoryReducer,
        budget: budgetReducer,
    },
});

export default store;