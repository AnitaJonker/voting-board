# Feature Voting Board

A lightweight full-stack application built with Django (DRF) and React that allows users to create feature ideas and vote on them.

---

## 🚀 Tech Stack

### Backend

- Python 3.13
- Django 5.x
- Django REST Framework
- SQLite (default DB)
- Token Authentication

### Frontend

- React (Vite / Create React App depending on setup)
- Fetch API for backend communication

---

## 📦 Features

### Backend (Django API)

- User authentication (login with seeded user)
- Create feature ideas (authenticated)
- List ideas sorted by:
  - Most recent
  - Most votes
- Vote / unvote on ideas
- Enforced rule: one vote per user per idea
- Single automated test for voting constraint

### Frontend (React SPA)

- Login form (token-based authentication)
- Idea list view
- Create new idea
- Vote / unvote ideas
- Sorting (votes / newest)
- Basic loading and error states

---

## 🔐 Authentication

- Token-based authentication using Django REST Framework
- A seeded user is required for login

### Example seeded user:

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone <repo-url>
cd voting-board
```

## Backend setup

```
python -m venv .venv
.venv\Scripts\activate # Windows
pip install -r requirements.txt
```

### Run migrations:

```
python manage.py migrate

python manage.py createsuperuser
```

## Start backend server:

```
python manage.py runserver
```

### API runs at:

```
http://127.0.0.1:8000/api/
```

## 3. Frontend setup

```
cd frontend
npm install
npm run dev
```

### Frontend runs at:

```
http://localhost:3000
```

## 📡 API Endpoints

- Auth
- POST /api/login/ → returns token
- Ideas
- GET /api/ideas/ → list ideas
- POST /api/ideas/ → create idea
- Voting
- POST /api/ideas/<id>/vote/ → vote
- DELETE /api/ideas/<id>/vote/ → unvote

## 🧪 Testing

Run backend tests:
`python manage.py test`

## 🧠 Design Notes

- Django REST Framework used for rapid API development
- Token authentication chosen for simplicity
- SQLite used for local development convenience
- Voting constraint enforced at database level using unique constraints

## 📌 Trade-offs

- Minimal authentication system (no registration flow)
- Simple frontend state management (no Redux or external state library)
- Basic styling to prioritise functionality over UI polish

## 🎯 Future Improvements (Optional)

- Optimistic UI for voting
- Pagination for idea list
- Search functionality
- Enhanced UI/UX styling
- Real-time vote updates

## License

This project is for assessment purposes.
