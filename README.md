# BudgetWise Finance Tracker

A complete full-stack personal finance tracking application built with Spring Boot and React.

## 🎯 Features

### 🔐 Authentication & Security
- User registration and login system
- JWT token-based authentication
- Secure password handling with validation
- Session management with automatic logout
- User data isolation (each user sees only their data)

### 💰 Transaction Management
- Add income and expense transactions
- Categorized transactions (9 expense categories, 6 income categories)
- Date tracking for all transactions
- Real-time transaction filtering (All/Income/Expenses)
- User-specific transaction storage and retrieval

### 📊 Financial Dashboard
- **Summary Cards**: Total Income, Total Expenses, Net Balance
- **Visual Analytics**: Expense breakdown by category with progress bars
- **Quick Stats**: Average income/expense, total transactions, savings rate
- **Transaction History**: Chronological list with category and date info
- **Real-time Updates**: All data updates instantly when transactions are added

### 🎨 Modern UI/UX
- Professional gradient-based design
- Responsive layout that works on all devices
- Interactive modal forms for adding transactions
- Color-coded transaction types (green for income, red for expenses)
- Smooth animations and hover effects

## 🏗️ Architecture

- **Backend**: Spring Boot (Java 17) with MySQL database
- **Frontend**: React.js with modern UI components
- **Authentication**: JWT-based security system
- **Database**: MySQL with user-specific data isolation

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budgetwise-finance-tracker/backend
   ```

2. **Configure MySQL Database**
   ```sql
   CREATE DATABASE budgetwise;
   CREATE USER 'budgetwise_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON budgetwise.* TO 'budgetwise_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update application.properties**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/budgetwise
   spring.datasource.username=budgetwise_user
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
   
   # JWT Configuration
   jwt.secret=your-secret-key-here
   jwt.expiration=86400000
   
   # Server Configuration
   server.port=8081
   ```

4. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8081

## 📁 Project Structure

```
budgetwise-finance-tracker/
├── backend/
│   ├── src/main/java/com/budgetwise/
│   │   ├── controller/          # REST API controllers
│   │   ├── model/              # JPA entities
│   │   ├── repository/         # Data access layer
│   │   ├── security/           # JWT and security configuration
│   │   ├── dto/               # Data transfer objects
│   │   └── BudgetWiseApplication.java
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Utility functions
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔒 Security Notes

### Current Security Measures
- JWT tokens stored in sessionStorage (cleared on browser close)
- CSRF protection enabled for API endpoints
- Password encryption using BCrypt
- User data isolation at database level
- Input validation on both frontend and backend

### Known Security Considerations
- **JWT Storage**: Currently using sessionStorage. For production, consider httpOnly cookies
- **Development Dependencies**: Some npm audit warnings exist in development dependencies (react-scripts ecosystem)
- **HTTPS**: Ensure HTTPS is enabled in production
- **Environment Variables**: Use environment variables for sensitive configuration

### Production Recommendations
1. Use httpOnly cookies for JWT storage
2. Enable HTTPS/TLS
3. Use environment variables for database credentials and JWT secrets
4. Implement rate limiting
5. Add request logging and monitoring
6. Regular security audits and dependency updates

## 🛠️ API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/summary` - Get financial summary

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Development dependency vulnerabilities in react-scripts ecosystem (non-runtime)
- JWT tokens in sessionStorage (acceptable for demo, consider httpOnly cookies for production)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.