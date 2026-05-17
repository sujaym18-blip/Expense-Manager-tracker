# 🚀 Quick Start Guide - Expense Manager Backend

## 5-Minute Setup

### Step 1: Install Dependencies (1 minute)
```bash
cd backend
npm install
```

### Step 2: Setup MongoDB Atlas (2 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create cluster (free tier)
4. Create database user
5. Get connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-manager?retryWrites=true&w=majority
   ```

### Step 3: Setup Environment (1 minute)

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=supersecretkey123changeinthis
FRONTEND_URL=http://localhost:3000
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Step 4: Run Server (1 minute)

```bash
npm run dev
```

✅ Server running on http://localhost:5000

---

## Test It Immediately

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

You'll get back:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user details */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Create Transaction
```bash
# Save your token from login response
TOKEN="your_jwt_token_here"

# Get a category ID first
curl -X GET http://localhost:5000/api/categories \
  -H "Authorization: Bearer $TOKEN"

# Then create a transaction (use one of the category IDs)
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "expense",
    "amount": 50,
    "category": "category_id_here",
    "description": "Lunch at restaurant",
    "date": "2024-05-13T12:00:00Z"
  }'
```

---

## Common Issues & Fixes

### MongoDB Connection Error
**Error:** `Error connecting to MongoDB: connect ECONNREFUSED`

**Fix:** 
1. Check MONGODB_URI in .env
2. Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
3. Verify database user password

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Fix:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

### JWT Secret Error
**Error:** `JsonWebTokenError: invalid token`

**Fix:**
1. Ensure JWT_SECRET is set in .env
2. Token format is: `Authorization: Bearer <token>`
3. Include space between Bearer and token

### Email Not Sending
**Error:** `Error sending password reset email`

**Fix:**
1. Go to: https://myaccount.google.com/apppasswords
2. Generate new Gmail App Password
3. Use the 16-character password in SMTP_PASSWORD
4. Ensure 2FA is enabled on Gmail

---

## Environment Variables Explained

```env
# Server port
PORT=5000

# Environment (development/production)
NODE_ENV=development

# MongoDB connection string from Atlas
MONGODB_URI=mongodb+srv://...

# Secret key for signing JWT tokens
JWT_SECRET=change_this_in_production!

# How long JWT tokens last
JWT_EXPIRE=7d

# How long password reset tokens last
JWT_RESET_EXPIRE=1h

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Email service configuration
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_FROM_NAME=Expense Manager
```

---

## Available Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Install new dependency
npm install package-name

# Update all dependencies
npm update
```

---

## API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/logout
```

### User
```
GET    /api/user/profile
PATCH  /api/user/profile
POST   /api/user/change-password
DELETE /api/user/account
GET    /api/user/statistics
```

### Transactions
```
POST   /api/transactions
GET    /api/transactions
GET    /api/transactions/:id
PATCH  /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/transactions/summary/monthly?month=2024-05
```

### Categories
```
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PATCH  /api/categories/:id
DELETE /api/categories/:id
GET    /api/categories/:id/statistics
```

### Budgets
```
POST   /api/budgets
GET    /api/budgets
GET    /api/budgets/:id
PATCH  /api/budgets/:id
DELETE /api/budgets/:id
GET    /api/budgets/status/:month
```

### Utility
```
GET    /api/health
```

---

## Using Postman (Recommended)

1. Download: https://www.postman.com/downloads/
2. Import endpoints from API_DOCUMENTATION.md
3. Add Authorization tab > Type: Bearer Token
4. Paste your JWT token
5. Make requests!

**Pro Tip:** Use Postman environment variables:
```
base_url = http://localhost:5000/api
token = (your jwt token from login)
```

Then use: `{{base_url}}/transactions` with `Authorization: Bearer {{token}}`

---

## Project Structure Overview

```
backend/
├── src/
│   ├── config/    ← Database setup
│   ├── models/    ← MongoDB schemas
│   ├── routes/    ← API endpoints
│   ├── controllers/ ← Business logic
│   ├── middleware/  ← Auth, validation, errors
│   ├── utils/     ← Helpers, email, validators
│   ├── app.js     ← Express setup
│   └── server.js  ← Server startup
├── .env.example   ← Environment template
├── package.json   ← Dependencies
├── README.md      ← Full documentation
└── API_DOCUMENTATION.md ← Detailed API reference
```

---

## Debugging Tips

### Enable Debug Logging
Add to `.env`:
```env
NODE_ENV=development
```

### Check Database
Use MongoDB Atlas web console to:
- View collections
- See documents
- Run queries
- Monitor performance

### Postman Tips
- Save requests for reuse
- Use environment variables
- Check request/response body
- Monitor headers

### Console Output
Look for:
- ✅ Database connected
- ✅ Server running on port 5000
- Request logs (method, path)
- Error messages with stack trace

---

## What's Next?

1. ✅ Backend running locally
2. Test all endpoints in Postman
3. Create some test transactions
4. Set a budget and test alerts
5. Ready for PHASE 2: Frontend!

---

## Need Help?

- Check `README.md` for detailed setup
- See `API_DOCUMENTATION.md` for endpoint details
- Review `BACKEND_LOGIC_REFERENCE.md` for business logic
- Check error messages in console
- Verify `.env` file configuration

---

**You're all set! Happy coding! 🎉**
