# 💰 Expense Manager - Full-Stack MERN Application

A production-ready expense tracking application built with the **MERN stack** (MongoDB, Express, React, Node.js). Track income, manage budgets, categorize expenses, and visualize your spending with beautiful charts and analytics.

---

## 🌟 Key Features

### 💳 Transaction Management
- Add, edit, and delete transactions with ease
- Categorize income and expenses
- Filter by type, category, date range, and amount
- Search transactions by description
- Pagination and sorting options
- Date-based organization

### 💰 Budget Tracking
- Set monthly budgets per expense category
- Real-time budget utilization tracking
- Visual progress bars with status indicators
- Alert when approaching budget limit
- Monthly budget overview
- Remaining budget calculation

### 📊 Analytics & Dashboard
- Overview cards showing total balance, income, and expenses
- Interactive charts (line, bar, pie) using Recharts
- Monthly income vs. expense trends
- Category-wise spending breakdown
- Recent transactions widget
- User statistics

### 🔐 User Authentication
- Secure user registration and login
- Password hashing with bcryptjs
- JWT-based authentication
- Forgot/reset password functionality
- Secure session management
- Profile management

### 👤 Account Management
- User profile with customizable details
- Multiple currency support (USD, EUR, GBP, INR, etc.)
- Password change functionality
- Account deletion with confirmation
- User settings and preferences

### 📱 Responsive Design
- Mobile-first responsive layout
- Works on all devices (320px to 1920px+)
- Optimized UI/UX for touch and desktop
- Progressive web app ready

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4
- **Database**: MongoDB Atlas (cloud)
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Email**: Nodemailer
- **File Upload**: Multer
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 3
- **Forms**: React Hook Form
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Deployment
- **Backend**: Render (or Railway/Fly.io)
- **Frontend**: Vercel (or Netlify)
- **Database**: MongoDB Atlas
- **Email**: Gmail SMTP (or SendGrid)

---

## 📋 Project Structure

```
Expense Manager Project/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # Helper functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # State management
│   │   ├── services/        # API client
│   │   ├── styles/          # Global CSS
│   │   ├── App.jsx          # Main routing
│   │   └── main.jsx         # React entry point
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
├── DEPLOYMENT_GUIDE.md      # Production deployment guide
├── PHASE1_SUMMARY.md        # Backend completion details
├── PHASE2_SUMMARY.md        # Frontend completion details
├── BACKEND_LOGIC_REFERENCE.md
├── COMPLETION_SUMMARY.md
└── QUICK_START.md           # 5-minute setup guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB Atlas account (free)
- Gmail account (for email service)

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your credentials to .env:
# - MONGODB_URI from MongoDB Atlas
# - JWT_SECRET (32+ characters)
# - Gmail SMTP credentials (optional)

# Start backend server
npm run dev
# Backend runs on http://localhost:5000
```

### Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The VITE_API_URL should point to your backend:
# VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Step 4: Test the App

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your balance and recent activity
4. **Add Transaction**: Create an income or expense
5. **Set Budget**: Set a monthly budget for a category
6. **View Reports**: Check analytics and trends

---

## 📖 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # Login user
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password with token
POST   /api/auth/logout             # Logout user
```

### User Endpoints (Protected)
```
GET    /api/user/profile            # Get user profile
PATCH  /api/user/profile            # Update user profile
POST   /api/user/change-password    # Change password
DELETE /api/user/account            # Delete account
GET    /api/user/statistics         # Get user statistics
```

### Transaction Endpoints (Protected)
```
GET    /api/transactions            # List transactions (with filtering)
POST   /api/transactions            # Create transaction
GET    /api/transactions/:id        # Get single transaction
PATCH  /api/transactions/:id        # Update transaction
DELETE /api/transactions/:id        # Delete transaction
GET    /api/transactions/summary/monthly  # Monthly summary
```

### Category Endpoints (Protected)
```
GET    /api/categories              # List categories
POST   /api/categories              # Create category
GET    /api/categories/:id          # Get category
PATCH  /api/categories/:id          # Update category
DELETE /api/categories/:id          # Delete category
GET    /api/categories/:id/statistics  # Category statistics
```

### Budget Endpoints (Protected)
```
GET    /api/budgets                 # List budgets
POST   /api/budgets                 # Create budget
GET    /api/budgets/:id             # Get budget
PATCH  /api/budgets/:id             # Update budget
DELETE /api/budgets/:id             # Delete budget
GET    /api/budgets/status/:month   # Budget status for month
```

See [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for detailed endpoints and examples.

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Create account at https://render.com
3. Create new Web Service connected to your repo
4. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
5. Deploy - auto-deploys on git push

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Create account at https://vercel.com
3. Import your repository
4. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
5. Deploy - auto-deploys on git push

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[PHASE1_SUMMARY.md](./PHASE1_SUMMARY.md)** - Backend implementation details
- **[PHASE2_SUMMARY.md](./PHASE2_SUMMARY.md)** - Frontend implementation details
- **[BACKEND_LOGIC_REFERENCE.md](./BACKEND_LOGIC_REFERENCE.md)** - Business logic and validation
- **[API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - Complete API reference
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment guide
- **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** - Project deliverables overview

---

## 💡 Usage Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### Add an Income Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income",
    "amount": 2000,
    "category": "CATEGORY_ID",
    "description": "Monthly salary",
    "date": "2024-01-15"
  }'
```

### Filter Transactions
```bash
curl "http://localhost:5000/api/transactions?type=expense&category=CATEGORY_ID&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 Design System

### Colors
- **Primary**: #3B82F6 (Blue) - Main actions
- **Secondary**: #10B981 (Green) - Income
- **Danger**: #EF4444 (Red) - Expenses
- **Warning**: #F59E0B (Amber) - Alerts
- **Background**: #F9FAFB (Light Gray)
- **Text**: #1F2937 (Dark Gray)

### Components
- Cards with shadows for content sections
- Rounded corners (8px standard)
- Consistent padding and spacing
- Interactive buttons with hover states
- Form inputs with focus rings
- Toast notifications for feedback

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Input validation and sanitization
- ✅ XSS prevention via React
- ✅ Secure session management
- ✅ HTTPS enforced in production
- ✅ Rate limiting on auth endpoints
- ✅ SQL/NoSQL injection prevention

---

## 📞 Support & Contributing

### Issues
Found a bug? Create an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

Built with:
- MongoDB Atlas for cloud database
- Express.js for robust API
- React for modern UI
- Node.js for backend runtime
- Tailwind CSS for styling
- Redux Toolkit for state management

---

## 📧 Contact

For questions or feedback, feel free to reach out!

---

**Happy Expense Tracking! 💰**

---

## Roadmap

### Current Status
- ✅ **PHASE 1**: Backend API complete with all endpoints
- ✅ **PHASE 2**: Frontend UI complete with all pages
- 🔄 **PHASE 3**: Advanced features (in progress)

### PHASE 3: Advanced Features (Planned)
- [ ] Recurring transactions
- [ ] Budget alerts via email
- [ ] Receipt image upload
- [ ] Data export (CSV/PDF)
- [ ] Dark mode toggle
- [ ] Transaction tags/labels
- [ ] Monthly reports
- [ ] Multi-user shared budgets
- [ ] Mobile app (React Native)
- [ ] Voice-based transaction entry

---

**Status**: ✅ Production Ready
**Last Updated**: January 2024
**Version**: 1.0.0
