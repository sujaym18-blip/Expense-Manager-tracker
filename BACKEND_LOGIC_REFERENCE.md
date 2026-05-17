# 🔍 Backend Validation & Business Logic Reference

## Validation Rules

### Registration Validation
```javascript
{
  email: Must be valid email format
  password: Minimum 6 characters, must contain letters + numbers
  firstName: Required, max 50 characters
  lastName: Required, max 50 characters
}
```

### Login Validation
```javascript
{
  email: Required, valid format
  password: Required
}
```

### Transaction Validation
```javascript
{
  type: Required, must be "income" or "expense"
  amount: Must be > 0
  category: Required, valid ObjectId
  description: Optional, max 500 chars
  date: Required, valid ISO date
  paymentMethod: Optional (cash, card, bank_transfer, wallet, other)
  tags: Optional array
}
```

### Category Validation
```javascript
{
  name: Required, 2-50 characters, unique per user
  icon: Optional, max 50 chars (emoji recommended)
  color: Optional, valid hex color (#RGB or #RRGGBB)
  type: Optional (income, expense, both)
  description: Optional, max 500 chars
}
```

### Budget Validation
```javascript
{
  category: Required, valid ObjectId
  limit: Required, must be > 0
  month: Required, format YYYY-MM
  alertThreshold: Optional, 0-100 (default 80)
  notes: Optional, max 500 chars
}
```

### Profile Update Validation
```javascript
{
  firstName: Required if provided, max 50 chars
  lastName: Required if provided, max 50 chars
  phone: Optional, valid phone format
  currency: Optional (USD, EUR, GBP, INR, AUD, CAD, JPY, CNY)
}
```

---

## Business Logic

### Authentication Flow

#### Registration
1. Validate input
2. Check if email already exists → Error 400 if duplicate
3. Create user with hashed password
4. Create default categories (15 total)
5. Send welcome email (non-blocking)
6. Generate JWT token
7. Return user + token

#### Login
1. Validate input
2. Find user by email
3. Compare password with hash
4. Update lastLogin timestamp
5. Generate JWT token
6. Return user + token

#### Password Reset
1. Generate reset token with 1-hour expiry
2. Save token to database
3. Send email with reset link
4. User clicks link, enters new password
5. Verify token is valid and not expired
6. Hash new password
7. Clear reset token
8. Generate new JWT token

---

### Transaction Management

#### Create Transaction
1. Validate all inputs
2. Create transaction with userId, type, amount, category, date
3. Populate category details
4. **If expense:**
   - Get month from transaction date (YYYY-MM format)
   - Find budget for this category + month
   - If budget exists:
     - Add amount to budget.spent
     - Check if budget.percentageSpent >= alertThreshold
     - If yes and alertSent is false:
       - Send budget alert email
       - Set alertSent = true
5. Return transaction

#### Update Transaction
1. Validate inputs
2. Find original transaction
3. Update fields if provided
4. **If amount or type changed:**
   - If was expense → Reduce old budget.spent
   - If now expense → Add to new budget.spent
5. Return updated transaction

#### Delete Transaction
1. Find transaction
2. **If was expense:**
   - Find budget for that category + month
   - Reduce budget.spent by transaction.amount
   - Reset alertSent = false (allow re-alert next month)
3. Delete transaction
4. Return success

#### Get Transactions with Filters
1. Build filter object from query params
2. Add userId to filter
3. **Handle filters:**
   - type: exact match
   - category: exact match
   - startDate/endDate: date range
   - search: regex on description (case-insensitive)
4. Apply pagination (default page=1, limit=10, max=100)
5. Apply sorting (default: -date)
6. Return paginated results

#### Monthly Summary
1. Get start and end date for month
2. Find all transactions for user in that month
3. **Calculate:**
   - income = sum of all transactions where type="income"
   - expenses = sum of all transactions where type="expense"
   - balance = income - expenses
   - transactionCount = total count
4. **Category breakdown:**
   - Group expense transactions by category
   - Sum amount per category
   - Count transactions per category
5. Return summary

---

### Category Management

#### Create Custom Category
1. Validate inputs
2. Check if category name already exists for user → Error if duplicate
3. Create category with:
   - Default icon: "📁" if not provided
   - Default color: "#3498db" if not provided
   - Default type: "both" if not provided
4. Return category

#### Get Categories
1. Build filter with userId
2. If type provided: filter where type = provided type OR type = "both"
3. Sort by: isDefault (descending) → name (ascending)
4. Return categories

#### Update Category
1. Verify it's not a default category (error if default)
2. If name changed: check for duplicate (error if exists)
3. Update provided fields
4. Return updated category

#### Delete Category
1. Verify it's not a default category (error if default)
2. Check if category has any transactions (error if has)
3. Delete category
4. Return success

#### Category Statistics
1. Validate category belongs to user
2. Filter transactions by:
   - userId
   - category
   - date range (if provided)
3. **Calculate:**
   - totalAmount = sum of all amounts
   - transactionCount = count
   - averageAmount = total / count
   - byType.income = sum where type="income"
   - byType.expense = sum where type="expense"
4. Return stats

---

### Budget Management

#### Create Budget
1. Validate inputs
2. Check if budget already exists for user + category + month → Error if exists
3. Verify category belongs to user
4. **Calculate already spent:**
   - Query transactions where:
     - userId = authenticated user
     - category = provided category
     - type = "expense"
     - date between month start and end
   - Sum the amounts
5. Create budget with:
   - spent = calculated amount
   - alertThreshold = provided or default 80
   - alertSent = false
6. Return budget

#### Get Budget Status for Month
1. Find all budgets for user for that month
2. **Calculate totals:**
   - totalLimit = sum of all budget.limit
   - totalSpent = sum of all budget.spent
   - remainingBudget = totalLimit - totalSpent
   - totalPercentageSpent = (totalSpent / totalLimit) * 100
3. **For each budget, determine status:**
   - percentageSpent = (spent / limit) * 100
   - status = "exceeded" if >= 100
   - status = "warning" if >= alertThreshold
   - status = "ok" if < alertThreshold
4. **Collect alerts:**
   - If percentageSpent >= alertThreshold
   - Add message: "You've spent XX% of your [Category] budget"
5. Return comprehensive status object

#### Update Budget
1. Find budget
2. Update: limit, alertThreshold, or notes
3. Return updated budget

---

### Default Categories

**Income Categories (5):**
1. Salary (💰, green)
2. Freelance (💻, blue)
3. Bonus (🎁, orange)
4. Investment (📈, purple)
5. Other Income (➕, gray)

**Expense Categories (10):**
1. Food & Dining (🍔, red)
2. Shopping (🛍️, pink)
3. Transportation (🚗, blue)
4. Utilities (💡, orange)
5. Entertainment (🎬, purple)
6. Healthcare (⚕️, green)
7. Education (📚, cyan)
8. Travel (✈️, red-orange)
9. Subscriptions (📱, deep-purple)
10. Other Expense (➖, gray)

**Auto-created:** One of each when user registers

---

### Email Templates

#### Welcome Email
- Greeting with first name
- List of features
- Engagement call-to-action
- Footer

#### Password Reset Email
- Greeting with first name
- Explanation of request
- Reset button/link
- Token expiry warning (1 hour)
- Footer

#### Budget Alert Email
- Alert heading
- Category name
- Amount spent vs limit
- Remaining amount
- Percentage spent
- Call to action (review spending)
- Footer

---

### Security Rules

1. **Password Storage:**
   - Never store plain text
   - Hash with bcrypt (10 salt rounds)
   - Compare using bcrypt.compare()

2. **JWT Token:**
   - Signed with JWT_SECRET
   - Expires in 7 days (default)
   - Sent in Authorization: Bearer header
   - Verified on every protected route

3. **Reset Token:**
   - Random 32+ character string
   - Stored in user.passwordResetToken
   - Expires in 1 hour
   - Cleared after use or expiry

4. **Data Access:**
   - Users can only see own data
   - Every query includes userId filter
   - No user data leakage in errors

5. **Input Security:**
   - Validate all inputs
   - Sanitize strings (trim, lowercase email)
   - Reject invalid types
   - Reject malformed dates/IDs

---

### Error Responses

#### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
Status: 400
```

#### Authentication Error
```json
{
  "success": false,
  "message": "Invalid token. Please login again."
}
Status: 401
```

#### Not Found Error
```json
{
  "success": false,
  "message": "Transaction not found"
}
Status: 404
```

#### Duplicate Error
```json
{
  "success": false,
  "message": "Email already registered. Please login."
}
Status: 400
```

#### Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
Status: 500
```

---

### HTTP Status Codes Used

- **200 OK** - Successful GET/PATCH
- **201 Created** - Successful POST
- **400 Bad Request** - Validation/business logic error
- **401 Unauthorized** - Missing/invalid token
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server error

---

### Database Constraints

#### Unique Constraints
- User.email (unique, indexed)
- Category: userId + name (unique)
- Budget: userId + category + month (unique)

#### Indexes
- User: email
- Transaction: userId + date, userId + category + date, userId + type + date
- Category: userId + name
- Budget: userId + category + month
- Reminder: userId + isActive + reminderDate

#### Field Restrictions
- User.password: min 6 chars, never returned in responses
- Transaction.amount: min 0
- Budget.limit: min 0
- Budget.alertThreshold: 0-100
- Category.name: 2-50 chars
- Transaction.description: max 500 chars

---

### Calculation Examples

#### Budget Percentage Calculation
```
percentageSpent = (spent / limit) * 100

Example:
- Limit: $500
- Spent: $400
- Percentage: (400 / 500) * 100 = 80%
- Status: "warning" (if alert threshold = 80)
```

#### Monthly Balance
```
income = sum of all transactions where type = "income"
expenses = sum of all transactions where type = "expense"
balance = income - expenses

Example:
- Income: $5000
- Expenses: $2000
- Balance: $3000 (savings)
```

#### Category Breakdown
```
Group transactions by category:
- Food & Dining: $300 (8 transactions, avg $37.50)
- Shopping: $200 (5 transactions, avg $40)
- Transportation: $150 (3 transactions, avg $50)
Total Expense: $650
```

---

### Pagination Logic

```javascript
page = parseInt(query.page) || 1
limit = parseInt(query.limit) || 10

// Validate
if (page < 1) page = 1
if (limit < 1) limit = 1
if (limit > 100) limit = 100

// Calculate
skip = (page - 1) * limit

// Get data
data = await model.find().skip(skip).limit(limit)
total = await model.countDocuments(filter)

// Response
{
  page: page,
  limit: limit,
  total: total,
  pages: Math.ceil(total / limit)
}
```

---

*This document serves as a quick reference for the backend business logic and validation rules.*
