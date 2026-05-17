# 💰 Expense Manager - MERN Stack Application

A production-quality full-stack expense management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🎯 Project Overview

Expense Manager is a comprehensive personal finance application that helps users track income and expenses, manage budgets, and gain insights into their spending patterns. It's designed as a portfolio project showcasing professional MERN development practices.

### Key Features
- ✅ User authentication with JWT
- ✅ Income and expense tracking
- ✅ Budget management with alerts
- ✅ Transaction categorization
- ✅ Monthly financial summaries
- ✅ Category-wise spending analytics
- ✅ Custom categories
- ✅ Email notifications
- ✅ Responsive design
- ✅ Production-ready code

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Request validation
- **Nodemailer** - Email service
- **Multer** - File uploads
- **CORS** - Cross-origin requests

### Frontend (Upcoming in PHASE 2)
- **React.js** - UI library
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Framer Motion** - Animations

---

## 📋 Project Structure

```
expense-manager-backend/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── userController.js     # User management
│   │   ├── transactionController.js
│   │   ├── categoryController.js
│   │   └── budgetController.js
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Transaction.js
│   │   ├── Category.js
│   │   ├── Budget.js
│   │   └── Reminder.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── transaction.js
│   │   ├── category.js
│   │   └── budget.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Error handling
│   │   └── validation.js         # Request validation
│   ├── utils/
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   ├── validators.js         # Validation rules
│   │   └── sendEmail.js          # Email utilities
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── uploads/                      # Receipt uploads folder
├── .env.example                  # Environment template
├── .gitignore
├── package.json
├── API_DOCUMENTATION.md          # Complete API docs
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
```bash
cd backend
npm install
```

2. **Setup environment variables**
```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your values
```

3. **Configure .env**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (Get URL from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-manager?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
JWT_RESET_EXPIRE=1h

# Email (Gmail SMTP)
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM_NAME=Expense Manager

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get connection string
6. Paste in MONGODB_URI

### Gmail Setup for Emails

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password at [Gmail App Passwords](https://myaccount.google.com/apppasswords)
3. Use the generated password in SMTP_PASSWORD

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:5000`

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 📚 API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Examples

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Create Transaction**
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{
    "type": "expense",
    "amount": 50,
    "category": "CATEGORY_ID",
    "description": "Lunch",
    "date": "2024-05-13T12:00:00Z"
  }'
```

---

## 🏗️ Architecture

### MVC Pattern
- **Models** - Mongoose schemas with validation
- **Controllers** - Business logic for each resource
- **Routes** - API endpoints definition
- **Middleware** - Authentication, validation, error handling

### Error Handling
- Centralized error handler middleware
- Async error wrapper for try-catch
- Consistent error response format
- Proper HTTP status codes

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Input validation and sanitization
- CORS configuration
- Environment variable protection

---

## 📊 Database Schema

### User
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  currency: String,
  isEmailVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  userId: ObjectId,
  type: String (income/expense),
  amount: Number,
  category: ObjectId,
  description: String,
  date: Date,
  paymentMethod: String,
  receiptImage: String (optional),
  tags: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  userId: ObjectId,
  name: String,
  icon: String,
  color: String,
  type: String (income/expense/both),
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget
```javascript
{
  userId: ObjectId,
  category: ObjectId,
  limit: Number,
  month: String (YYYY-MM),
  spent: Number,
  alertThreshold: Number (0-100),
  alertSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Reminder
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  type: String,
  reminderDate: Date,
  frequency: String,
  isActive: Boolean,
  notificationSent: Boolean,
  priority: String
}
```

---

## 🔐 Authentication Flow

1. **Registration**
   - Validate input
   - Hash password
   - Create user
   - Create default categories
   - Return JWT token

2. **Login**
   - Validate credentials
   - Compare passwords
   - Generate JWT token
   - Return token to client

3. **Protected Routes**
   - Extract token from header
   - Verify token
   - Attach user to request
   - Proceed to controller

4. **Password Reset**
   - Generate reset token
   - Send email with reset link
   - Verify token on reset
   - Update password

---

## 📈 Features Walkthrough

### Transaction Management
- Create income/expense transactions
- Categorize transactions
- Filter by category, date, type
- Sort and paginate results
- Search in descriptions
- Automatic budget tracking

### Budget Management
- Set monthly budgets per category
- Track spending against budget
- Automatic alert emails when threshold exceeded
- View budget status for month
- Category-wise breakdown

### Analytics
- Monthly income/expense summary
- Category-wise spending breakdown
- Total balance calculation
- Transaction statistics

---

## 🚢 Deployment

### Deploy Backend on Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables
6. Deploy

### Deploy Backend on Railway

1. Push code to GitHub
2. Go to [Railway Dashboard](https://railway.app)
3. Create new project
4. Connect GitHub repo
5. Add MongoDB plugin
6. Set environment variables
7. Deploy

### Deploy Frontend on Vercel

1. Create React app
2. Push to GitHub
3. Go to [Vercel Dashboard](https://vercel.com)
4. Import project
5. Set environment variable for API URL
6. Deploy

---

## 🧪 Testing

### Manual Testing with cURL

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed examples.

### Testing with Postman

1. Import API endpoints
2. Set base URL variable
3. Use auth token in headers
4. Test all endpoints

### Automated Testing (Future)
- Unit tests with Jest
- Integration tests
- API tests with Supertest

---

## 📝 Code Standards

### Naming Conventions
- `camelCase` for variables and functions
- `PascalCase` for classes and components
- `UPPER_CASE` for constants
- Descriptive names (no abbreviations)

### Code Quality
- Clean, readable code
- Minimal comments (code is self-documenting)
- DRY principle (Don't Repeat Yourself)
- Single responsibility principle
- Error handling in all async operations

### Security
- Never commit .env files
- Hash passwords before storing
- Validate all inputs
- Use HTTPS in production
- Keep dependencies updated

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### JWT Token Issues
- Verify JWT_SECRET in .env
- Check token format in Authorization header
- Ensure token hasn't expired

### Email Not Sending
- Verify Gmail credentials
- Generate new App Password if needed
- Check email settings in .env
- Verify SMTP_SERVICE is "gmail"

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

---

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Guide](https://jwt.io/introduction)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [RESTful API Design](https://restfulapi.net/)

---

## 🎓 Interview Tips

This project demonstrates:
- ✅ MVC architecture knowledge
- ✅ RESTful API design
- ✅ Database modeling with MongoDB
- ✅ Authentication & security
- ✅ Error handling patterns
- ✅ Input validation
- ✅ Middleware concepts
- ✅ Async/await patterns
- ✅ Clean code practices
- ✅ Production-ready thinking

**Key Points to Highlight:**
- Scalable folder structure
- Comprehensive error handling
- Email notification system
- Budget tracking logic
- Data validation at multiple levels
- Security best practices
- Professional documentation

---

## 🤝 Contributing

This is a portfolio project. Future enhancements:
- [ ] Recurring expenses
- [ ] Receipt image uploads
- [ ] PDF/CSV export
- [ ] Dark mode
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-currency support
- [ ] Scheduled reminders

---

## 📄 License

MIT License - feel free to use this project for learning

---

## 🙋 Support

For issues or questions, refer to:
- API_DOCUMENTATION.md
- Code comments
- Error messages

---

## ✨ Project Status

**PHASE 1** ✅ Complete - Backend API
- Authentication system
- Transaction management
- Category management
- Budget tracking
- API endpoints
- Error handling

**PHASE 2** ⏳ Upcoming - Frontend
- React setup
- Dashboard UI
- Transaction forms
- Charts and analytics
- Protected routes

**PHASE 3** ⏳ Upcoming - Advanced Features
- Receipt uploads
- PDF/CSV export
- Recurring expenses
- Email reminders
- Dark mode

---

**Built with ❤️ for MERN learning and interviews**
