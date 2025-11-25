
```md
# Architecture — BudgetWise (High-Level System Design)

## 📌 Overview
BudgetWise is a 3-layer architecture project consisting of:

1. **Frontend (React)** – user interface, dashboards, charts, forms  
2. **Backend (Spring Boot)** – REST API, authentication, business logic  
3. **Database (MySQL)** – stores users, transactions, budgets, goals, exports, forum data  

---

## 📌 System Components

### 🔐 Authentication Service
- JWT-based login/signup
- Password hashing (BCrypt)
- Role management (user/admin)

### 💵 Transaction Service
- Income/expense CRUD
- Category assignment
- OCR receipt processing (future feature)

### 🗓️ Budget & Savings Service
- Monthly budgets per category
- Remaining budget calculation
- Savings goal tracking
- Alerts when budgets exceed limits

### 📊 Analytics & Insights
- Category pie charts
- Monthly spending trends
- Income vs expense bar charts

### 📤 Export Service
- Generate CSV and PDF exports
- Optional cloud backup (Drive/Dropbox)

### 💬 Community Forum (Optional)
- Posts & comments
- Like/Reply functionality

---

## 📌 Data Flow (Simplified)

1. User interacts with React UI  
2. React sends REST API requests (Axios)  
3. Spring Boot backend authenticates via JWT  
4. Backend performs DB operations  
5. Backend returns JSON responses  
6. React updates UI with charts/tables

---

## 📌 Deployment Architecture

- Frontend → deployed on Netlify / Vercel / Render  
- Backend → deployed via Docker on Render / Heroku / AWS  
- MySQL → hosted on Render, Railway, or local Docker  

---

## 📌 Database Schema (from project PDF)
Tables included:
- `users`
- `transactions`
- `budgets`
- `savings_goals`
- `exports`
- `forum_posts`, `forum_comments` (optional)

You can view the full schema diagram in:
📄 **docs/project-spec.pdf**

---

## 📌 Future Enhancements
- ML-based transaction categorization  
- Auto-budget recommendations  
- Graph-based expense prediction  
- AI chatbot inside the app

