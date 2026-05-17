import api from './api';

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

// User APIs
export const userAPI = {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.patch('/user/profile', data),
    changePassword: (data) => api.post('/user/change-password', data),
    deleteAccount: (password) => api.delete('/user/account', { data: { password } }),
    getStatistics: () => api.get('/user/statistics'),
};

// Transaction APIs
export const transactionAPI = {
    create: (data) => api.post('/transactions', data),
    getAll: (params) => api.get('/transactions', { params }),
    getOne: (id) => api.get(`/transactions/${id}`),
    update: (id, data) => api.patch(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
    getMonthlySummary: (month) => api.get(`/transactions/summary/monthly?month=${month}`),
};

// Category APIs
export const categoryAPI = {
    create: (data) => api.post('/categories', data),
    getAll: (params) => api.get('/categories', { params }),
    getOne: (id) => api.get(`/categories/${id}`),
    update: (id, data) => api.patch(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
    getStatistics: (id, params) => api.get(`/categories/${id}/statistics`, { params }),
};

// Budget APIs
export const budgetAPI = {
    create: (data) => api.post('/budgets', data),
    getAll: (params) => api.get('/budgets', { params }),
    getOne: (id) => api.get(`/budgets/${id}`),
    update: (id, data) => api.patch(`/budgets/${id}`, data),
    delete: (id) => api.delete(`/budgets/${id}`),
    getStatus: (month) => api.get(`/budgets/status/${month}`),
};