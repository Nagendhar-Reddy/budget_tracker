
# 💰 Personal Budget Tracker

A full-stack web application for tracking income, expenses, and managing monthly budgets with interactive data visualizations.

## 🚀 Features

- **User Authentication** - Secure token-based login
- **Dashboard** - Financial summary with D3.js charts
- **Transaction Management** - Add, edit, delete income and expenses
- **Budget Planning** - Set and track monthly budgets
- **Advanced Filtering** - Filter by date, category, amount
- **Data Visualization** - Interactive D3.js pie and bar charts
- **Pagination** - Efficient data browsing

## 🛠️ Technology Stack

**Backend:**
- Django 4.2.7
- Django REST Framework 3.14.0
- SQLite Database
- Token Authentication

**Frontend:**
- React 18.2.0
- D3.js 7.8.5
- Axios
- Pure CSS

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd budget_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (test account)
python manage.py createsuperuser
# Username: testuser
# Password: testpass123



Create some default categories (Optional - via Django shell)

bashpython manage.py shell
pythonfrom django.contrib.auth.models import User
from budget.models import Category

user = User.objects.get(username='testuser')

# Income Categories
Category.objects.create(user=user, name='Salary', type='income')
Category.objects.create(user=user, name='Freelance', type='income')
Category.objects.create(user=user, name='Investment', type='income')

# Expense Categories
Category.objects.create(user=user, name='Groceries', type='expense')
Category.objects.create(user=user, name='Entertainment', type='expense')
Category.objects.create(user=user, name='Transport', type='expense')
Category.objects.create(user=user, name='Bills', type='expense')
Category.objects.create(user=user, name='Shopping', type='expense')

exit()
# Run server
python manage.py runserver
```

Backend will run on: `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd budget_frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: `http://localhost:3000`

## 🔑 Test Credentials

```
Username: testuser
Password: testpass123
```

## 📊 API Endpoints

### Authentication
- - `POST /api/register/` - User login
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

### Dashboard
- `GET /api/dashboard/` - Get financial summary

### Categories
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category
- `PUT /api/categories/{id}/` - Update category
- `DELETE /api/categories/{id}/` - Delete category

### Transactions
- `GET /api/transactions/` - List transactions (with filters & pagination)
- `POST /api/transactions/` - Create transaction
- `PUT /api/transactions/{id}/` - Update transaction
- `DELETE /api/transactions/{id}/` - Delete transaction

### Budgets
- `GET /api/budgets/` - List budgets
- `POST /api/budgets/` - Create budget
- `PUT /api/budgets/{id}/` - Update budget

## 📁 Project Structure

```
budget-tracker/
├── budget_backend/          # Django backend
│   ├── budget/             # Main app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   └── urls.py         # App URLs
│   ├── budget_backend/     # Project settings
│   └── requirements.txt    # Python dependencies
│
├── budget_frontend/         # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app
│   │   └── index.jsx       # Entry point
│   └── package.json        # Node dependencies
│
└── README.md               # This file
```

## 🎨 Screenshots

### Dashboard
- Financial summary cards
- Expense breakdown pie chart
- Income vs Expense bar chart

### Transactions
- Add/Edit/Delete transactions
- Filter by date, category, amount
- Pagination support

### Budget Management
- Set monthly budgets
- Budget comparison chart
- Overspending alerts

## ✅ Features Implemented

- ✅ User authentication (Token-based)
- ✅ CRUD operations for all entities
- ✅ Category management
- ✅ Transaction tracking
- ✅ Budget setting & comparison
- ✅ Advanced filtering
- ✅ Pagination (10 items/page)
- ✅ 3 D3.js interactive charts
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

## 🧪 Testing

1. Login with test credentials
2. Add categories (Salary, Groceries, etc.)
3. Create transactions
4. Set monthly budget
5. View dashboard charts
6. Use filters on transaction list
7. Edit/Delete transactions

## 📝 License

This project uses:
- Django (BSD License)
- React (MIT License)
- D3.js (ISC License)

## 👨‍💻 Developer

Developed as part of technical assessment.

## 🤝 Contributing

This is an assessment project. Not open for contributions.

## 📧 Contact

For queries regarding this project, please refer to the assessment documentation.
=======
# budget-tracker
>>>>>>> f568c2486e17e5c7d2c3780ef07b20a2de16dba7
