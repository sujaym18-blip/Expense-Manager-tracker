# 🧪 EXPENSE MANAGER - COMPLETE TESTING GUIDE

This guide provides comprehensive testing instructions for the Expense Manager application to ensure all features work correctly before deployment.

---

## 🚀 PRE-TEST SETUP

### 1. Ensure Backend is Running
```bash
cd backend
npm install
npm run dev
# Should see: "Server running on port 5000"
```

### 2. Ensure Frontend is Running
```bash
cd frontend
npm install
npm run dev
# Should see: "ready in XXXms"
# Access: http://localhost:3000
```

### 3. Ensure MongoDB is Connected
- Check backend console for: "MongoDB connected"
- If not, verify MONGODB_URI in .env

---

## ✅ AUTHENTICATION TESTING

### Test: User Registration

**Steps:**
1. Navigate to: http://localhost:3000/register
2. Fill in the form:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john@example.com"
   - Password: "Password123"
   - Confirm Password: "Password123"
3. Click "Register"

**Expected Result:**
- ✅ Page redirects to login
- ✅ Toast shows "Registration successful"
- ✅ User created in MongoDB
- ✅ Email can be used to login

**API Test:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'

# Expected: 201 status with token
```

---

### Test: User Login

**Steps:**
1. Navigate to: http://localhost:3000/login
2. Fill in:
   - Email: "john@example.com"
   - Password: "Password123"
3. Click "Login"

**Expected Result:**
- ✅ Redirects to /dashboard
- ✅ Token stored in localStorage
- ✅ User info displayed in sidebar
- ✅ Protected pages accessible

**API Test:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'

# Expected: 200 status with token and user object
# Save token for next tests: TOKEN="your-token-here"
```

---

### Test: Forgot Password

**Steps:**
1. Navigate to: http://localhost:3000/login
2. Click "Forgot password?"
3. Enter email: "john@example.com"
4. Click "Send Reset Link"

**Expected Result:**
- ✅ Toast shows "Password reset email sent"
- ✅ Email sent to user inbox (check Gmail)
- ✅ Email contains reset link with token

**API Test:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'

# Expected: 200 status with message
# Check email for reset link
```

---

### Test: Reset Password

**Steps:**
1. Receive password reset email
2. Click reset link (contains token)
3. Page should navigate to /reset-password?token=XXXXX
4. Enter:
   - New Password: "NewPassword456"
   - Confirm Password: "NewPassword456"
5. Click "Reset Password"

**Expected Result:**
- ✅ Redirects to login
- ✅ Toast shows "Password reset successful"
- ✅ Can login with new password

**API Test:**
```bash
# Get token from reset email
TOKEN="token-from-email"

curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'$TOKEN'",
    "newPassword": "NewPassword456"
  }'

# Expected: 200 status
```

---

### Test: Logout

**Steps:**
1. Login to account
2. Click "Logout" button in sidebar
3. Confirm logout action

**Expected Result:**
- ✅ Redirects to landing page
- ✅ Token removed from localStorage
- ✅ Protected pages not accessible
- ✅ Attempting to access /dashboard redirects to /login

---

## 📊 DASHBOARD TESTING

### Test: Dashboard Loads

**Steps:**
1. Login to account
2. Navigate to: http://localhost:3000/dashboard
3. Wait for data to load

**Expected Result:**
- ✅ Page loads without errors
- ✅ Loading spinner shows while fetching
- ✅ Three summary cards display:
  - Total Balance: $X.XX
  - Income: $X.XX
  - Expense: $X.XX
- ✅ Charts render with data
- ✅ Recent transactions show

**Verify:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/user/statistics

# Should show balance, income, expense data
```

---

### Test: Charts Display

**Steps:**
1. Ensure at least 3 transactions exist
2. Check dashboard for:
   - Line chart (income vs expense)
   - Pie chart (spending by category)
   - Bar chart (monthly overview)

**Expected Result:**
- ✅ All three charts render
- ✅ Charts show actual data
- ✅ Charts are responsive
- ✅ No console errors

---

## 💳 TRANSACTION TESTING

### Test: Add Income Transaction

**Steps:**
1. Navigate to: http://localhost:3000/transactions/add
2. Fill form:
   - Type: Select "Income"
   - Category: Select "Salary" or similar
   - Amount: 2000.00
   - Date: Today's date
   - Description: "Monthly salary"
3. Click "Create"

**Expected Result:**
- ✅ Redirects to /transactions
- ✅ Toast shows "Transaction created successfully"
- ✅ New transaction appears in list
- ✅ Amount shows in green (income)

**API Test:**
```bash
# Get category ID first
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/categories

# Get category ID from response
CATEGORY_ID="category-id-here"

curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income",
    "amount": 2000,
    "category": "'$CATEGORY_ID'",
    "description": "Monthly salary",
    "date": "2024-01-15"
  }'

# Expected: 201 status with transaction object
```

---

### Test: Add Expense Transaction

**Steps:**
1. Navigate to: http://localhost:3000/transactions/add
2. Fill form:
   - Type: Select "Expense"
   - Category: Select "Groceries" or similar
   - Amount: 150.50
   - Date: Today's date
   - Description: "Weekly groceries"
3. Click "Create"

**Expected Result:**
- ✅ Redirects to /transactions
- ✅ Toast shows "Transaction created successfully"
- ✅ New transaction appears in list
- ✅ Amount shows in red (expense)

---

### Test: Transaction Validation

**Steps:**
1. Go to Add Transaction page
2. Try to submit with:
   - Empty amount field
   - Zero amount
   - Empty date
   - No category

**Expected Result:**
- ✅ Validation error messages appear
- ✅ Form doesn't submit
- ✅ Errors highlight the fields

---

### Test: Filter Transactions by Type

**Steps:**
1. Navigate to: http://localhost:3000/transactions
2. Select "Income" from Type filter
3. Observe results

**Expected Result:**
- ✅ Only income transactions show
- ✅ Page updates without reload
- ✅ Pagination resets to page 1

**Steps (Expense):**
1. Select "Expense" from Type filter

**Expected Result:**
- ✅ Only expense transactions show

---

### Test: Filter Transactions by Category

**Steps:**
1. On transactions page
2. Select a category from Category dropdown
3. Observe results

**Expected Result:**
- ✅ Only transactions in that category show
- ✅ Works with type filter
- ✅ Results update instantly

---

### Test: Search Transactions

**Steps:**
1. On transactions page
2. Type "salary" in search box
3. Press Enter or wait for auto-search

**Expected Result:**
- ✅ Transactions with "salary" in description show
- ✅ Case-insensitive search
- ✅ Works with other filters

---

### Test: Pagination

**Steps:**
1. Create 15+ transactions
2. On transactions page, page 1 shows 10 items
3. Click "Next" button

**Expected Result:**
- ✅ Page 2 loads
- ✅ Remaining transactions show
- ✅ "Previous" button enabled
- ✅ "Next" button disabled on last page

---

### Test: Edit Transaction

**Steps:**
1. On transactions page
2. Click edit icon on any transaction
3. Modify amount: 175.50
4. Click "Update"

**Expected Result:**
- ✅ Redirects to transactions list
- ✅ Toast shows "Transaction updated successfully"
- ✅ New amount appears in list

**API Test:**
```bash
TRANSACTION_ID="transaction-id-here"

curl -X PATCH http://localhost:5000/api/transactions/$TRANSACTION_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 175.50}'

# Expected: 200 status
```

---

### Test: Delete Transaction

**Steps:**
1. On transactions page
2. Click delete icon on any transaction
3. Confirm deletion

**Expected Result:**
- ✅ Toast shows "Transaction deleted successfully"
- ✅ Transaction removed from list
- ✅ Count decreases

**API Test:**
```bash
TRANSACTION_ID="transaction-id-here"

curl -X DELETE http://localhost:5000/api/transactions/$TRANSACTION_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected: 200 status
```

---

## 💰 BUDGET TESTING

### Test: Create Budget

**Steps:**
1. Navigate to: http://localhost:3000/budget
2. Click "Add Budget"
3. Fill form:
   - Category: "Groceries"
   - Budget Limit: 500.00
4. Click "Create Budget"

**Expected Result:**
- ✅ Form closes
- ✅ New budget card appears
- ✅ Shows monthly limit
- ✅ Shows $0 spent initially

**API Test:**
```bash
CATEGORY_ID="category-id-here"

curl -X POST http://localhost:5000/api/budgets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "'$CATEGORY_ID'",
    "limit": 500,
    "month": "2024-01"
  }'

# Expected: 201 status
```

---

### Test: Budget Progress Tracking

**Steps:**
1. Create budget with $500 limit
2. Create expense transaction in that category: $150
3. Return to Budget page

**Expected Result:**
- ✅ Spent amount shows: $150
- ✅ Progress bar fills 30%
- ✅ Progress bar is green (under budget)
- ✅ Remaining shows: $350

---

### Test: Budget Status Indicators

**Steps:**
1. Create budget with $500 limit
2. Create expense: $300 → Check color (green, on-track)
3. Create expense: $450 → Check color (yellow, warning)
4. Create expense: $550 → Check color (red, exceeded)

**Expected Result:**
- ✅ Color changes based on percentage
- ✅ Green: < 80% spent
- ✅ Yellow: 80-99% spent
- ✅ Red: 100%+ spent

---

### Test: Month Selector

**Steps:**
1. On budget page
2. Change month to previous/next month
3. Create budget in that month

**Expected Result:**
- ✅ Budgets change when month changes
- ✅ Can navigate between months
- ✅ Different data shown for each month

---

### Test: Delete Budget

**Steps:**
1. On budget page
2. Click delete icon on any budget
3. Confirm deletion

**Expected Result:**
- ✅ Toast shows "Budget deleted"
- ✅ Budget card removed
- ✅ List updates

**API Test:**
```bash
BUDGET_ID="budget-id-here"

curl -X DELETE http://localhost:5000/api/budgets/$BUDGET_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected: 200 status
```

---

## 👤 PROFILE TESTING

### Test: View Profile

**Steps:**
1. Navigate to: http://localhost:3000/profile
2. Observe profile data

**Expected Result:**
- ✅ User avatar displays
- ✅ User name shows
- ✅ User email shows
- ✅ Form fields populated

**API Test:**
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/user/profile

# Should return user data
```

---

### Test: Update Profile

**Steps:**
1. On profile page
2. Change:
   - First Name: "Jonathan"
   - Phone: "+1-555-123-4567"
   - Currency: "EUR"
3. Click "Save Changes"

**Expected Result:**
- ✅ Toast shows "Profile updated successfully"
- ✅ Form updates with new values
- ✅ Sidebar shows new name
- ✅ Data persists on refresh

**API Test:**
```bash
curl -X PATCH http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "phone": "+1-555-123-4567",
    "currency": "EUR"
  }'

# Expected: 200 status
```

---

## ⚙️ SETTINGS TESTING

### Test: Change Password

**Steps:**
1. Navigate to: http://localhost:3000/settings
2. Fill password form:
   - Current Password: "OldPassword123"
   - New Password: "NewPassword456"
   - Confirm Password: "NewPassword456"
3. Click "Update Password"

**Expected Result:**
- ✅ Toast shows "Password changed successfully"
- ✅ Form clears
- ✅ New password works for login

**API Test:**
```bash
curl -X POST http://localhost:5000/api/user/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword456"
  }'

# Expected: 200 status
```

---

### Test: Delete Account

**Steps:**
1. On settings page
2. Click "Delete My Account"
3. Click "Confirm Delete"
4. Enter password: (your password)
5. Click "Confirm Delete" again

**Expected Result:**
- ✅ Toast shows "Account deleted successfully"
- ✅ Redirects to landing page
- ✅ Can't login with deleted account
- ✅ All user data removed from database

**API Test:**
```bash
curl -X DELETE http://localhost:5000/api/user/account \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password": "YourPassword123"}'

# Expected: 200 status
# Note: After this, user cannot use the token anymore
```

---

## 🔐 SECURITY TESTING

### Test: Protected Routes

**Steps:**
1. Logout from account
2. Try to access: http://localhost:3000/dashboard
3. Browser should redirect to /login

**Expected Result:**
- ✅ Redirects to login immediately
- ✅ Protected routes require authentication

---

### Test: Token Validation

**Steps:**
1. Get token from login
2. Open browser DevTools → Application → localStorage
3. Find "token" key
4. Edit token (change a character)
5. Try to make API call

**Expected Result:**
- ✅ API returns 401 Unauthorized
- ✅ User redirected to login
- ✅ Invalid tokens rejected

---

### Test: Password Hashing

**Steps:**
1. Check MongoDB directly (mongosh)
2. Find user in database
3. Check password field

**Expected Result:**
- ✅ Password is hashed (not plain text)
- ✅ Hash starts with $2b$ (bcrypt format)

---

## 🎨 UI/UX TESTING

### Test: Responsive Design (Mobile)

**Steps:**
1. Open DevTools (F12)
2. Click device toggle (mobile icon)
3. Select iPhone SE (375px)
4. Resize to different sizes

**Expected Result:**
- ✅ Layout adjusts for mobile
- ✅ Sidebar becomes hamburger menu
- ✅ Text readable without zoom
- ✅ Buttons clickable
- ✅ Tables scroll horizontally if needed

---

### Test: Form Validation Errors

**Steps:**
1. Go to any form (login, register, etc.)
2. Try to submit empty form
3. Try to submit with invalid data

**Expected Result:**
- ✅ Red error messages appear
- ✅ Form doesn't submit
- ✅ Errors are specific and helpful

---

### Test: Toast Notifications

**Steps:**
1. Perform any action (login, create transaction, etc.)
2. Watch for toast notification

**Expected Result:**
- ✅ Toast appears at top
- ✅ Shows success/error message
- ✅ Auto-dismisses after 3 seconds
- ✅ Can close manually

---

### Test: Loading States

**Steps:**
1. Create transaction
2. Before response completes, observe button

**Expected Result:**
- ✅ Button shows loading spinner
- ✅ Button disabled during loading
- ✅ Shows "Saving..." text

---

## 🐛 ERROR HANDLING TESTING

### Test: Invalid Email

**Steps:**
1. Try to register with: "notanemail"
2. Try to login with: "invalid@"

**Expected Result:**
- ✅ Validation error on form
- ✅ Won't submit
- ✅ Error message says "Invalid email"

---

### Test: Weak Password

**Steps:**
1. Try to register with password: "123"

**Expected Result:**
- ✅ Validation error: "Min 6 characters"
- ✅ Form won't submit

---

### Test: Network Error

**Steps:**
1. Open DevTools Network tab
2. Throttle connection to "Offline"
3. Try to create transaction

**Expected Result:**
- ✅ Toast shows error message
- ✅ User sees "Network error" or similar
- ✅ Graceful error handling

---

### Test: Backend Offline

**Steps:**
1. Stop backend server (Ctrl+C)
2. Try to login or create transaction

**Expected Result:**
- ✅ Toast shows error
- ✅ User gets feedback
- ✅ App doesn't crash

---

## 📊 DATA TESTING

### Test: Large Dataset

**Steps:**
1. Create 100+ transactions
2. Navigate transactions page
3. Apply filters

**Expected Result:**
- ✅ Pagination works smoothly
- ✅ No performance issues
- ✅ Filters work on large data
- ✅ Sort works correctly

---

### Test: Data Persistence

**Steps:**
1. Create transaction
2. Refresh page (F5)
3. Check if transaction still visible

**Expected Result:**
- ✅ Data persists
- ✅ Still logged in
- ✅ All data loads correctly

---

## 📱 BROWSER COMPATIBILITY

### Test: Chrome
- [ ] Navigate to each page
- [ ] Test all features
- [ ] Check console for errors

### Test: Firefox
- [ ] Repeat navigation and features
- [ ] Check for compatibility issues

### Test: Safari
- [ ] Test on Mac/iOS if available
- [ ] Verify styling

### Test: Edge
- [ ] Verify all features work
- [ ] Check performance

---

## ✅ FINAL CHECKLIST

### Authentication ✅
- [ ] Register new user
- [ ] Login user
- [ ] Logout user
- [ ] Forgot password
- [ ] Reset password
- [ ] Protected routes work
- [ ] Token storage works

### Dashboard ✅
- [ ] Loads without errors
- [ ] Shows correct balances
- [ ] Charts display data
- [ ] Recent transactions show

### Transactions ✅
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Filter by type
- [ ] Filter by category
- [ ] Search transactions
- [ ] Pagination works
- [ ] Validation works

### Budgets ✅
- [ ] Create budget
- [ ] Track spending
- [ ] Status indicators work
- [ ] Month selector works
- [ ] Delete budget

### Profile & Settings ✅
- [ ] View profile
- [ ] Update profile
- [ ] Change password
- [ ] Delete account

### UI/UX ✅
- [ ] Responsive design
- [ ] Forms validate
- [ ] Toasts notify
- [ ] Loading states show
- [ ] Errors handled

### API ✅
- [ ] All endpoints respond
- [ ] Authentication works
- [ ] Validation enforced
- [ ] Errors formatted

### Database ✅
- [ ] MongoDB connects
- [ ] Data persists
- [ ] Relationships work
- [ ] Indexes exist

---

## 🎯 DEPLOYMENT TESTING

Before deploying to production:

1. [ ] Build frontend: `npm run build`
2. [ ] Check build output: `npm run preview`
3. [ ] Test all features in production build
4. [ ] Run backend in production: `NODE_ENV=production npm start`
5. [ ] Test all APIs with production build
6. [ ] Check performance metrics
7. [ ] Test on staging environment
8. [ ] Final approval before production

---

## 🐛 DEBUGGING TIPS

### Check Console for Errors
```javascript
// DevTools → Console tab
// Look for red error messages
```

### Check Network Requests
```javascript
// DevTools → Network tab
// Check API responses
// Verify status codes
```

### Check Redux State
```javascript
// Install Redux DevTools Extension
// Verify state changes
// Time-travel debug
```

### Check Database
```bash
# Using mongosh
mongosh
use expensedb
db.users.find()
db.transactions.find()
```

---

## 📋 TEST REPORT TEMPLATE

```markdown
# Test Report - Expense Manager

Date: _________
Tester: _________
Build: _________

## Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Skipped: ___

## Issues Found
1. Issue: ___
   Severity: Critical/High/Medium/Low
   Steps to reproduce: ___
   Expected: ___
   Actual: ___

## Sign-Off
- [ ] Ready for deployment
- [ ] Needs fixes before deployment
- [ ] Ready for beta testing

Signature: _________ Date: _________
```

---

## 🎉 TEST COMPLETE!

If all tests pass, your application is ready for:
- ✅ Sharing with others
- ✅ Deployment to production
- ✅ Portfolio showcase
- ✅ Interview discussions

---

**Happy Testing!** 🧪

