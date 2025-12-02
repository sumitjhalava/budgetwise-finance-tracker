# BudgetWise Finance Tracker - API Documentation

## Base URL
```
http://localhost:8081
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. User Registration
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Responses:**
- `409 Conflict` - Email already exists
- `400 Bad Request` - Invalid input data

---

### 2. User Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials

---

## 💰 Transaction Endpoints

### 3. Get User Transactions
```http
GET /api/transactions
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "description": "Grocery Shopping",
    "amount": 85.50,
    "type": "expense",
    "category": "Food & Dining",
    "date": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "description": "Salary",
    "amount": 3000.00,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-01",
    "createdAt": "2024-01-01T09:00:00Z"
  }
]
```

---

### 4. Create New Transaction
```http
POST /api/transactions
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "description": "Coffee Shop",
  "amount": 4.50,
  "type": "expense",
  "category": "Food & Dining",
  "date": "2024-01-16"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "description": "Coffee Shop",
  "amount": 4.50,
  "type": "expense",
  "category": "Food & Dining",
  "date": "2024-01-16",
  "createdAt": "2024-01-16T08:15:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid/missing token

---

### 5. Delete Transaction
```http
DELETE /api/transactions/{id}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id` (Long) - Transaction ID

**Response:**
- `200 OK` - Transaction deleted successfully
- `403 Forbidden` - Transaction belongs to another user
- `404 Not Found` - Transaction not found

---

### 6. Get Financial Summary
```http
GET /api/transactions/summary
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "totalIncome": 3000.00,
  "totalExpenses": 1250.75,
  "balance": 1749.25,
  "expensesByCategory": {
    "Food & Dining": 450.25,
    "Transportation": 200.00,
    "Shopping": 300.50,
    "Bills & Utilities": 300.00
  }
}
```

---

## 📊 Data Models

### User Model
```json
{
  "id": "Long",
  "name": "String (required, 2-50 chars)",
  "email": "String (required, valid email, unique)",
  "password": "String (required, min 6 chars)"
}
```

### Transaction Model
```json
{
  "id": "Long",
  "description": "String (required, max 255 chars)",
  "amount": "Double (required, positive)",
  "type": "String (required: 'income' or 'expense')",
  "category": "String (required)",
  "date": "String (ISO date format: YYYY-MM-DD)",
  "createdAt": "String (ISO datetime)"
}
```

### Available Categories

**Expense Categories:**
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Travel
- Education
- Other

**Income Categories:**
- Salary
- Freelance
- Investment
- Business
- Gift
- Other

---

## 📝 Example Usage (cURL)

### Register User
```bash
curl -X POST http://localhost:8081/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Transaction
```bash
curl -X POST http://localhost:8081/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Lunch",
    "amount": 12.50,
    "type": "expense",
    "category": "Food & Dining",
    "date": "2024-01-16"
  }'
```

### Get Transactions
```bash
curl -X GET http://localhost:8081/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🚨 Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required/failed
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

Error responses include descriptive messages when possible.