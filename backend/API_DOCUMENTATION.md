# Expense Manager API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-05-13T10:00:00Z"
    },
    "token": "jwt_token"
  }
}
```

---

### 1.2 Login User
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token"
  }
}
```

---

### 1.3 Forgot Password
**POST** `/auth/forgot-password`

Request password reset link via email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### 1.4 Reset Password
**POST** `/auth/reset-password`

Reset password using the token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "user": { /* user object */ },
    "token": "new_jwt_token"
  }
}
```

---

### 1.5 Logout
**POST** `/auth/logout`

Logout user (client-side token removal).

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. User Endpoints

### 2.1 Get User Profile
**GET** `/user/profile` (Protected)

Get current authenticated user's profile.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "currency": "USD",
    "createdAt": "2024-05-13T10:00:00Z"
  }
}
```

---

### 2.2 Update User Profile
**PATCH** `/user/profile` (Protected)

Update user profile information.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321",
  "currency": "EUR"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

---

### 2.3 Change Password
**POST** `/user/change-password` (Protected)

Change current password.

**Request Body:**
```json
{
  "currentPassword": "OldSecurePass123",
  "newPassword": "NewSecurePass456"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 2.4 Delete Account
**DELETE** `/user/account` (Protected)

Permanently delete user account and all associated data.

**Request Body:**
```json
{
  "password": "current_password"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 3. Transaction Endpoints

### 3.1 Create Transaction
**POST** `/transactions` (Protected)

Create a new income or expense transaction.

**Request Body:**
```json
{
  "type": "expense",
  "amount": 50.00,
  "category": "category_id",
  "description": "Lunch at restaurant",
  "date": "2024-05-13T12:00:00Z",
  "paymentMethod": "card",
  "tags": ["food", "dining"]
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "transaction_id",
    "type": "expense",
    "amount": 50.00,
    "category": {
      "_id": "category_id",
      "name": "Food & Dining",
      "icon": "🍔",
      "color": "#e74c3c"
    },
    "description": "Lunch at restaurant",
    "date": "2024-05-13T12:00:00Z",
    "createdAt": "2024-05-13T12:05:00Z"
  }
}
```

---

### 3.2 Get All Transactions
**GET** `/transactions?page=1&limit=10&type=expense&category=category_id&startDate=2024-05-01&endDate=2024-05-31&sort=-date` (Protected)

Get paginated list of transactions with filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `type` (string): "income" or "expense"
- `category` (string): Category ID
- `startDate` (ISO string): Filter from date
- `endDate` (ISO string): Filter to date
- `sort` (string): "date", "-date", "amount", "-amount"
- `search` (string): Search in description

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    { /* transaction objects */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### 3.3 Get Single Transaction
**GET** `/transactions/:id` (Protected)

Get details of a specific transaction.

**Response:** 200 OK
```json
{
  "success": true,
  "data": { /* transaction object */ }
}
```

---

### 3.4 Update Transaction
**PATCH** `/transactions/:id` (Protected)

Update a transaction.

**Request Body:** (all fields optional)
```json
{
  "type": "expense",
  "amount": 60.00,
  "category": "category_id",
  "description": "Updated description",
  "date": "2024-05-13T13:00:00Z",
  "paymentMethod": "card"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": { /* updated transaction object */ }
}
```

---

### 3.5 Delete Transaction
**DELETE** `/transactions/:id` (Protected)

Delete a transaction.

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

---

### 3.6 Get Monthly Summary
**GET** `/transactions/summary/monthly?month=2024-05` (Protected)

Get summary of income, expenses, and category breakdown for a month.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "month": "2024-05",
    "income": 5000.00,
    "expenses": 1500.00,
    "balance": 3500.00,
    "transactionCount": 25,
    "categoryBreakdown": [
      {
        "category": {
          "_id": "category_id",
          "name": "Food & Dining",
          "icon": "🍔",
          "color": "#e74c3c"
        },
        "amount": 300.00,
        "count": 8
      }
    ]
  }
}
```

---

## 4. Category Endpoints

### 4.1 Create Custom Category
**POST** `/categories` (Protected)

Create a new custom category.

**Request Body:**
```json
{
  "name": "Groceries",
  "icon": "🛒",
  "color": "#27ae60",
  "type": "expense",
  "description": "Grocery shopping and groceries"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "category_id",
    "name": "Groceries",
    "icon": "🛒",
    "color": "#27ae60",
    "type": "expense",
    "isDefault": false,
    "createdAt": "2024-05-13T10:00:00Z"
  }
}
```

---

### 4.2 Get All Categories
**GET** `/categories?type=expense` (Protected)

Get all categories (default + custom).

**Query Parameters:**
- `type` (string): Filter by "income" or "expense"

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Food & Dining",
      "icon": "🍔",
      "color": "#e74c3c",
      "type": "expense",
      "isDefault": true
    }
  ]
}
```

---

### 4.3 Get Single Category
**GET** `/categories/:id` (Protected)

Get details of a specific category.

**Response:** 200 OK
```json
{
  "success": true,
  "data": { /* category object */ }
}
```

---

### 4.4 Update Category
**PATCH** `/categories/:id` (Protected)

Update a custom category (default categories cannot be modified).

**Request Body:** (all fields optional)
```json
{
  "name": "Grocery Shopping",
  "icon": "🛍️",
  "color": "#2ecc71"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": { /* updated category object */ }
}
```

---

### 4.5 Delete Category
**DELETE** `/categories/:id` (Protected)

Delete a custom category (default categories cannot be deleted, must have no transactions).

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### 4.6 Get Category Statistics
**GET** `/categories/:id/statistics?startDate=2024-05-01&endDate=2024-05-31` (Protected)

Get spending statistics for a category.

**Query Parameters:**
- `startDate` (ISO string): Filter from date
- `endDate` (ISO string): Filter to date

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "category": "Food & Dining",
    "totalAmount": 500.00,
    "transactionCount": 15,
    "averageAmount": 33.33,
    "byType": {
      "income": 0,
      "expense": 500.00
    }
  }
}
```

---

## 5. Budget Endpoints

### 5.1 Create Budget
**POST** `/budgets` (Protected)

Set a monthly budget for a category.

**Request Body:**
```json
{
  "category": "category_id",
  "limit": 500.00,
  "month": "2024-05",
  "alertThreshold": 80,
  "notes": "May monthly food budget"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "_id": "budget_id",
    "category": {
      "_id": "category_id",
      "name": "Food & Dining",
      "icon": "🍔",
      "color": "#e74c3c"
    },
    "limit": 500.00,
    "spent": 125.50,
    "month": "2024-05",
    "alertThreshold": 80,
    "percentageSpent": 25.10,
    "remaining": 374.50
  }
}
```

---

### 5.2 Get All Budgets
**GET** `/budgets?month=2024-05` (Protected)

Get all budgets (optionally filtered by month).

**Query Parameters:**
- `month` (string): Filter by month in YYYY-MM format

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    { /* budget objects */ }
  ]
}
```

---

### 5.3 Get Single Budget
**GET** `/budgets/:id` (Protected)

Get details of a specific budget.

**Response:** 200 OK
```json
{
  "success": true,
  "data": { /* budget object */ }
}
```

---

### 5.4 Update Budget
**PATCH** `/budgets/:id` (Protected)

Update a budget.

**Request Body:** (all fields optional)
```json
{
  "limit": 600.00,
  "alertThreshold": 75,
  "notes": "Updated budget"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Budget updated successfully",
  "data": { /* updated budget object */ }
}
```

---

### 5.5 Delete Budget
**DELETE** `/budgets/:id` (Protected)

Delete a budget.

**Response:** 200 OK
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

### 5.6 Get Budget Status
**GET** `/budgets/status/:month` (Protected)

Get comprehensive budget status for a month.

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "month": "2024-05",
    "totalLimit": 2500.00,
    "totalSpent": 1245.75,
    "remainingBudget": 1254.25,
    "totalPercentageSpent": "49.83",
    "budgetSummary": [
      {
        "category": "Food & Dining",
        "limit": 500.00,
        "spent": 350.00,
        "remaining": 150.00,
        "percentageSpent": "70.00",
        "status": "warning"
      }
    ],
    "alerts": [
      {
        "category": "Food & Dining",
        "message": "You've spent 70.00% of your Food & Dining budget"
      }
    ]
  }
}
```

---

## Error Responses

All error responses follow this format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No authentication token provided. Please login."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Status Codes

- **200 OK** - Successful GET/PATCH request
- **201 Created** - Successful POST request
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid authentication
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Next Steps

1. Set up MongoDB Atlas connection
2. Configure environment variables in .env
3. Run `npm install`
4. Run `npm run dev` to start development server
5. Test endpoints using Postman or cURL
