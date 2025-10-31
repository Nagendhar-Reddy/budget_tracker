# 💰 Personal Budget Tracker

A full-stack web application for tracking income, expenses, and managing monthly budgets with interactive data visualizations.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)

## 🚀 Features

- **User Authentication** - Secure token-based registration and login
- **Dashboard** - Real-time financial summary with interactive D3.js charts
- **Transaction Management** - Add, edit, and delete income and expenses
- **Budget Planning** - Set monthly budgets and track spending
- **Advanced Filtering** - Filter transactions by date, category, amount, and type
- **Data Visualization** - Pie charts for expense breakdown and bar charts for income vs expenses
- **Pagination** - Efficient data browsing with 10 items per page
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **Django** 4.2.7
- **Django REST Framework** 3.14.0
- **SQLite** Database
- **Token Authentication**

### Frontend
- **React** 18.2.0
- **D3.js** 7.8.5 (Data visualization)
- **Axios** (HTTP client)
- **Pure CSS** (Styling)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.8 or higher
- **Node.js** 14 or higher
- **npm** (comes with Node.js)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nagendhar-Reddy/budget_tracker.git
cd budget_tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd budget_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser account
python manage.py createsuperuser
# When prompted, enter:
# Username: testuser
# Email: test@example.com (or leave blank)
# Password: testpass123
# Password (again): testpass123

# Start the Django development server
python manage.py runserver
```

✅ Backend server will run at: **http://localhost:8000**

### 3. Frontend Setup

Open a **new terminal** window/tab:

```bash
# Navigate to frontend directory (from project root)
cd budget_frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

✅ Frontend application will run at: **http://localhost:3000**

### 4. (Optional) Create Sample Categories

To get started quickly with sample categories, open a new terminal:

```bash
# Navigate to backend directory
cd budget_backend

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Open Django shell
python manage.py shell
```

Then paste the following code:

```python
from django.contrib.auth.models import User
from budget.models import Category

# Get the test user
user = User.objects.get(username='testuser')

# Create Income Categories
Category.objects.create(user=user, name='Salary', type='income')
Category.objects.create(user=user, name='Freelance', type='income')
Category.objects.create(user=user, name='Investment', type='income')

# Create Expense Categories
Category.objects.create(user=user, name='Groceries', type='expense')
Category.objects.create(user=user, name='Entertainment', type='expense')
Category.objects.create(user=user, name='Transport', type='expense')
Category.objects.create(user=user, name='Bills', type='expense')
Category.objects.create(user=user, name='Shopping', type='expense')

print("✅ Sample categories created successfully!")
exit()
```

## 🎯 Usage

### Login Credentials

Use these credentials to login:

```
Username: testuser
Password: testpass123
```

### Getting Started

1. **Open the application** at http://localhost:3000
2. **Login** using the test credentials
3. **Create categories** for your income and expenses (or use the sample ones)
4. **Add transactions** by specifying amount, category, date, and description
5. **Set a budget** for the current month
6. **View dashboard** to see your financial summary with charts
7. **Filter transactions** using the search and filter options

## 📊 API Documentation

All API endpoints require authentication (except register and login).

### Authentication Header

Include this header in all authenticated requests:

```
Authorization: Token <your-token-here>
```

### Endpoints Overview

#### Authentication
- `POST /api/register/` - Register new user
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

#### Dashboard
- `GET /api/dashboard/?month=10&year=2024` - Get financial summary

#### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create new category
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

#### Transactions
- `GET /api/transactions/` - List transactions (with filters)
- `POST /api/transactions/` - Create transaction
- `PUT /api/transactions/{id}/` - Update transaction
- `DELETE /api/transactions/{id}/` - Delete transaction

**Query Parameters for Filtering:**
- `category` - Filter by category ID
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD)
- `type` - Filter by income/expense
- `min_amount` - Minimum amount
- `max_amount` - Maximum amount

#### Budgets
- `GET /api/budgets/` - List all budgets
- `POST /api/budgets/` - Create budget
- `GET /api/budgets/current_month/` - Get current month budget
- `PUT /api/budgets/{id}/` - Update budget

### Example API Requests

#### Register New User

```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "password2": "password123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

#### Create Transaction

```bash
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "category": 2,
    "type": "expense",
    "amount": "250.00",
    "description": "Weekly groceries",
    "date": "2024-10-31"
  }'
```

#### Get Dashboard Summary

```bash
curl -X GET "http://localhost:8000/api/dashboard/?month=10&year=2024" \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
budget_tracker/
│
├── budget_backend/              # Django Backend
│   ├── budget/                  # Main Django App
│   │   ├── migrations/          # Database migrations
│   │   ├── __init__.py
│   │   ├── admin.py             # Admin panel configuration
│   │   ├── apps.py              # App configuration
│   │   ├── models.py            # Database models (User, Category, Transaction, Budget)
│   │   ├── serializers.py       # DRF serializers
│   │   ├── urls.py              # App URL patterns
│   │   └── views.py             # API views and logic
│   │
│   ├── budget_backend/          # Project Settings
│   │   ├── __init__.py
│   │   ├── settings.py          # Django settings
│   │   ├── urls.py              # Main URL configuration
│   │   └── wsgi.py
│   │
│   ├── db.sqlite3               # SQLite database (created after migrations)
│   ├── manage.py                # Django management script
│   └── requirements.txt         # Python dependencies
│
├── budget_frontend/             # React Frontend
│   ├── public/                  # Static files
│   │   └── index.html
│   │
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   │   ├── Dashboard.jsx    # Dashboard with charts
│   │   │   ├── Login.jsx        # Login component
│   │   │   ├── Register.jsx     # Registration component
│   │   │   ├── Transactions.jsx # Transaction list and filters
│   │   │   ├── Budget.jsx       # Budget management
│   │   │   └── Categories.jsx   # Category management
│   │   │
│   │   ├── App.jsx              # Main application component
│   │   ├── index.jsx            # Entry point
│   │   └── index.css            # Global styles
│   │
│   ├── package.json             # Node.js dependencies
│   └── package-lock.json
│
└── README.md                    # This file
```

## 🧪 Testing

Follow these steps to test all features:

### 1. Authentication
- ✅ Register a new account
- ✅ Login with credentials
- ✅ Logout and login again

### 2. Categories
- ✅ Create income categories (Salary, Freelance, etc.)
- ✅ Create expense categories (Groceries, Bills, etc.)
- ✅ Edit category names
- ✅ Delete unused categories

### 3. Transactions
- ✅ Add income transactions
- ✅ Add expense transactions
- ✅ Edit transaction details
- ✅ Delete transactions
- ✅ Filter by date range
- ✅ Filter by category
- ✅ Filter by amount range
- ✅ Navigate through pages (pagination)

### 4. Budget
- ✅ Set monthly budget
- ✅ Update budget amount
- ✅ View budget progress

### 5. Dashboard
- ✅ View total income
- ✅ View total expenses
- ✅ View current balance
- ✅ Check expense pie chart
- ✅ Check income vs expense bar chart

## 🐛 Troubleshooting

### Port Already in Use

**Backend (Port 8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

**Frontend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Database Issues

If you encounter database errors:

```bash
cd budget_backend
# Delete the database
rm db.sqlite3

# Delete migrations (except __init__.py)
rm budget/migrations/0*.py

# Recreate migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser again
python manage.py createsuperuser
```

### CORS Errors

Ensure `CORS_ALLOWED_ORIGINS` in `budget_backend/budget_backend/settings.py` includes:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## 📝 License

This project uses:
- **Django** (BSD License)
- **React** (MIT License)
- **D3.js** (ISC License)

## 👨‍💻 Developer

Developed by **Nagendhar Reddy** as part of a technical assessment.

## 🔗 Links

- **GitHub Repository:** https://github.com/Nagendhar-Reddy/budget_tracker
- **Django Documentation:** https://docs.djangoproject.com/
- **React Documentation:** https://react.dev/
- **D3.js Documentation:** https://d3js.org/

---

**Note:** This is an assessment project and is not open for contributions.
