# HRMS Lite

A lightweight Human Resource Management System built with FastAPI and React + Material-UI.

## 🚀 Features

### Employee Management
- Add new employees with ID, name, email, and department
- View all employees in a clean table format
- Delete employees with confirmation
- Duplicate employee ID and email validation

### Attendance Management
- Mark attendance (Present/Absent) for any date
- View attendance history per employee
- Dashboard showing today's statistics

### Dashboard
- Total employees count
- Present today count
- Absent today count
- Quick action navigation

## 🛠 Tech Stack

### Backend
- **Python 3.11**
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - ORM for database operations
- **PyMySQL** - MySQL database driver
- **Pydantic** - Data validation

### Frontend
- **React 18**
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client

### Database
- **SQLite** (local development)
- **MySQL** (production)

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── app/
│   │   ├── routers/     # API route handlers
│   │   ├── database.py  # Database configuration
│   │   ├── models.py    # SQLAlchemy models
│   │   ├── schemas.py   # Pydantic schemas
│   │   ├── crud.py      # Database operations
│   │   └── main.py      # Application entry point
│   ├── requirements.txt
│   └── render.yaml      # Render deployment config
└── frontend/
    ├── src/
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── package.json
    └── vercel.json      # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL (optional, for production)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
# Edit .env with your database URL
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🌐 Deployment

### Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable:
   - `DATABASE_URL`: Your MySQL connection string
5. Deploy

### Frontend (Vercel)

1. Create a new project on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://hrms-api.onrender.com`)
5. Deploy

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql+pymysql://username:password@host:3306/hrms_db
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com
```

## 📊 API Endpoints

### Employees
- `GET /employees/` - List all employees
- `POST /employees/` - Create new employee
- `GET /employees/{id}` - Get employee by ID
- `DELETE /employees/{id}` - Delete employee

### Attendance
- `GET /attendance/employee/{id}` - Get attendance for employee
- `POST /attendance/` - Mark attendance
- `GET /attendance/` - Get all attendance records

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## ✅ Validation & Error Handling

- Required field validation
- Email format validation
- Duplicate employee ID prevention
- Duplicate email prevention
- Duplicate attendance date prevention
- Proper HTTP status codes
- Meaningful error messages

## 🎨 UI Features

- Responsive Material-UI design
- Loading states
- Error messages
- Empty states
- Confirmation dialogs
- Success notifications

## 📝 Assumptions & Limitations

- Single admin user (no authentication required)
- No payroll or leave management
- No employee editing (delete and recreate)
- Attendance can only be marked once per day per employee
- Date format: YYYY-MM-DD

## 🔗 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend**: [Your Render URL]

## 📄 License

This project is created for interview assessment purposes.

## 👨‍💻 Author

Created for Ethara AI Interview Assignment
