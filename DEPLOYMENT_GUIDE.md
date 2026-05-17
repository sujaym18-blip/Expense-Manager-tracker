# FULL-STACK EXPENSE MANAGER - DEPLOYMENT GUIDE

## 🎯 Project Overview

**Full-Stack MERN Application** (MongoDB, Express, React, Node.js) for personal expense tracking with budget management, analytics, and secure authentication.

- **Backend**: Node.js + Express API (port 5000)
- **Frontend**: React + Vite SPA (port 3000)
- **Database**: MongoDB Atlas cloud database
- **Auth**: JWT + bcrypt password hashing

---

## 🔧 PHASE 1: BACKEND SETUP & DEPLOYMENT

### Local Development

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Create .env file with MongoDB credentials
cp .env.example .env

# Configure .env:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expensedb
JWT_SECRET=your-secret-key-here-minimum-32-characters
JWT_EXPIRE=7d

# Email service (optional):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@expensemanager.com

NODE_ENV=development

# 3. Start development server
npm run dev
# Server runs on http://localhost:5000
```

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (M0 free tier)
4. Create database user with username/password
5. Whitelist IP: 0.0.0.0/0 (for development)
6. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### API Testing

```bash
# Test health endpoint
curl http://localhost:5000/

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'

# Note: Save the returned token for protected endpoints
TOKEN="your-jwt-token-here"

# Get profile (requires auth)
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Backend Production Deployment (Render.com)

```bash
# 1. Create account at https://render.com

# 2. Connect GitHub repository

# 3. Create new Web Service
# - Runtime: Node
# - Start Command: npm start
# - Environment Variables:
#   PORT=10000 (Render's port)
#   MONGODB_URI=your_atlas_uri
#   JWT_SECRET=production-secret-key
#   NODE_ENV=production

# 4. Deploy
# Push to main branch, Render auto-deploys

# Result: https://your-app.onrender.com
```

---

## 🔧 PHASE 2: FRONTEND SETUP & DEPLOYMENT

### Local Development

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# Configure .env:
VITE_API_URL=http://localhost:5000/api
# For production: https://your-backend.onrender.com/api

# 3. Start dev server
npm run dev
# Frontend runs on http://localhost:3000
# API proxy configured in vite.config.js

# 4. Build for production
npm run build
# Creates optimized dist/ folder
```

### Vite Dev Server

The dev server (vite.config.js) proxies API calls from `/api` to `http://localhost:5000/api` to avoid CORS issues during development.

**Development Flow**:
1. Frontend makes request to `http://localhost:3000/api/auth/login`
2. Vite dev server intercepts and proxies to `http://localhost:5000/api/auth/login`
3. Backend responds with token
4. Frontend stores token in Redux + localStorage
5. Axios interceptor adds `Authorization: Bearer $token` to all requests

### Frontend Production Deployment (Vercel)

```bash
# 1. Create account at https://vercel.com
# 2. Connect GitHub repository
# 3. Import project

# Vercel Configuration:
# Framework: Vite
# Build Command: npm run build
# Output Directory: dist

# Environment Variables:
# VITE_API_URL=https://your-backend.onrender.com/api

# 4. Deploy
# Click Deploy, Vercel builds and deploys automatically

# Result: https://your-app.vercel.app
```

---

## 📦 PRODUCTION DEPLOYMENT CHECKLIST

### Backend (Render)
- [ ] MongoDB Atlas cluster created and credentials added
- [ ] All environment variables configured
- [ ] Email service configured (Gmail SMTP or alternative)
- [ ] CORS enabled for frontend domain
- [ ] JWT secret key set (32+ characters)
- [ ] Health endpoint tested: `https://your-api.onrender.com/`
- [ ] Auth endpoints tested (register, login)
- [ ] Database indexes created
- [ ] Error logging configured
- [ ] Rate limiting configured (optional)

### Frontend (Vercel)
- [ ] Backend API URL configured in .env
- [ ] Build process tested locally (`npm run build`)
- [ ] All routes working correctly
- [ ] Authentication flow tested
- [ ] API calls using correct endpoints
- [ ] HTTPS enforced
- [ ] Custom domain configured (optional)
- [ ] Analytics configured (optional)

---

## 🔐 Security Best Practices

### Authentication
- ✅ Passwords hashed with bcryptjs (salt rounds: 10)
- ✅ JWT tokens signed with strong secret
- ✅ Token expiry: 7 days
- ✅ Refresh token support (optional)
- ✅ HTTPS enforced in production

### API Security
- ✅ CORS restricted to frontend domain
- ✅ Input validation on all endpoints
- ✅ SQL/NoSQL injection prevention (Mongoose)
- ✅ Rate limiting on auth endpoints
- ✅ Sensitive data not logged

### Frontend Security
- ✅ Token stored in localStorage (consider secure cookie)
- ✅ XSS protection via React's template escaping
- ✅ CSRF protection via SameSite cookies
- ✅ No sensitive data in Redux state (except token)
- ✅ Secure headers configured

---

## 📊 DATABASE SCHEMA

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  currency: String (default: 'USD'),
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (income/expense),
  amount: Number,
  category: ObjectId (ref: Category),
  description: String,
  date: Date,
  receiptURL: String,
  recurring: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  type: String (income/expense/both),
  icon: String (emoji),
  color: String,
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Budgets Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  limit: Number,
  spent: Number (calculated),
  month: String (YYYY-MM),
  createdAt: Date,
  updatedAt: Date
}
```

### Reminders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (budget_alert/payment_due),
  message: String,
  dueDate: Date,
  status: String (pending/sent/dismissed),
  frequency: String (once/weekly/monthly),
  createdAt: Date
}
```

---

## 🧪 TESTING GUIDE

### Backend API Testing (Postman/Insomnia)

1. **Authentication Endpoints**
   - POST `/api/auth/register` → Get token
   - POST `/api/auth/login` → Get token
   - POST `/api/auth/forgot-password` → Email sent
   - POST `/api/auth/reset-password` → Password updated

2. **User Endpoints**
   - GET `/api/user/profile` (protected) → User data
   - PATCH `/api/user/profile` (protected) → Updated user
   - POST `/api/user/change-password` (protected) → Password changed
   - GET `/api/user/statistics` (protected) → User stats

3. **Transaction Endpoints**
   - POST `/api/transactions` → Create
   - GET `/api/transactions?type=expense&page=1` → List with filters
   - GET `/api/transactions/:id` → Get single
   - PATCH `/api/transactions/:id` → Update
   - DELETE `/api/transactions/:id` → Delete

4. **Category Endpoints**
   - GET `/api/categories` → List
   - POST `/api/categories` → Create
   - PATCH `/api/categories/:id` → Update
   - DELETE `/api/categories/:id` → Delete

5. **Budget Endpoints**
   - GET `/api/budgets?month=2024-01` → List for month
   - POST `/api/budgets` → Create
   - PATCH `/api/budgets/:id` → Update
   - DELETE `/api/budgets/:id` → Delete

### Frontend Testing (Browser Dev Tools)

1. **Redux DevTools**
   - Monitor state changes
   - Time-travel debugging
   - Action dispatch tracking

2. **Network Tab**
   - Verify API calls
   - Check response data
   - Monitor token usage

3. **Application Tab**
   - Check localStorage (user, token)
   - Verify cookies

4. **Console**
   - Monitor error logs
   - Check Redux actions

---

## 📱 RESPONSIVE DESIGN TESTING

Test on these breakpoints:
- Mobile: 320px - 480px
- Tablet: 480px - 768px
- Desktop: 768px - 1200px
- Large Desktop: 1200px+

Tested on:
- iPhone 12/13/14 (Safari)
- Android (Chrome)
- iPad (Safari)
- Desktop (Chrome, Firefox, Safari)

---

## 🚀 CONTINUOUS DEPLOYMENT

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci && npm run test
      - run: npm run build
      # Deploy to Vercel/Render
```

### Git Workflow

```bash
# Development
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
git pull request

# After merge
git checkout main
git pull origin main
# Render/Vercel auto-deploy from main branch
```

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**MongoDB Connection Error**
```
Solution: Check MONGODB_URI in .env, ensure IP whitelisted in Atlas
```

**CORS Error**
```
Solution: Add frontend URL to CORS whitelist in app.js
```

**JWT Token Invalid**
```
Solution: Verify JWT_SECRET matches between frontend and backend
```

**Email Not Sending**
```
Solution: Check SMTP credentials, enable Less Secure Apps in Gmail
```

### Frontend Issues

**API 404 Not Found**
```
Solution: Check VITE_API_URL in .env, verify backend is running
```

**Redux State Not Updating**
```
Solution: Open Redux DevTools, check action dispatch
```

**Blank Page**
```
Solution: Check console for errors, verify .env file
```

**CORS Error in Production**
```
Solution: Ensure backend CORS allows frontend domain
```

---

## 📚 USEFUL COMMANDS

```bash
# Backend
npm run dev          # Start with hot reload
npm start            # Start production
npm test             # Run tests
npm run lint         # Lint code

# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint React code

# Database
mongosh             # MongoDB shell
# Show databases
# use expensedb
# db.users.find()
```

---

## 📞 SUPPORT & RESOURCES

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Express.js**: https://expressjs.com
- **React**: https://react.dev
- **Redux Toolkit**: https://redux-toolkit.js.org
- **Vite**: https://vitejs.dev

---

**Last Updated**: $(date)
**Project Status**: Production Ready ✅
