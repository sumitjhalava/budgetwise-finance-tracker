# BudgetWise Finance Tracker - Tech Stack

## 🖥️ Frontend Technologies

### Core Framework
- **React.js 18.3.1** - Modern JavaScript library for building user interfaces
- **React Router DOM 6.26.0** - Client-side routing for single-page applications
- **JavaScript ES6+** - Modern JavaScript features and syntax

### HTTP Client
- **Axios 1.7.0** - Promise-based HTTP client for API communication

### Build Tools
- **React Scripts 5.0.1** - Build toolchain for React applications
- **Webpack** - Module bundler (included with React Scripts)
- **Babel** - JavaScript compiler (included with React Scripts)

### Styling
- **CSS3** - Modern CSS with Flexbox and Grid
- **Inline Styles** - Component-scoped styling
- **Responsive Design** - Mobile-first approach

## ⚙️ Backend Technologies

### Core Framework
- **Spring Boot 3.5.8** - Java-based framework for building web applications
- **Java 17** - Long-term support version of Java
- **Maven 3.6+** - Dependency management and build tool

### Web Layer
- **Spring Web** - RESTful web services and MVC architecture
- **Spring Boot Starter Web** - Embedded Tomcat server

### Security
- **Spring Security** - Authentication and authorization framework
- **JWT (JSON Web Tokens)** - Stateless authentication
  - **jjwt-api 0.11.5** - JWT API
  - **jjwt-impl 0.11.5** - JWT implementation
  - **jjwt-jackson 0.11.5** - JWT Jackson integration
- **BCrypt** - Password hashing algorithm

### Data Layer
- **Spring Data JPA** - Data access abstraction layer
- **Hibernate** - Object-relational mapping (ORM) framework
- **MySQL Connector/J** - MySQL database driver

### Validation
- **Spring Boot Starter Validation** - Bean validation with Hibernate Validator
- **Jakarta Validation API** - Standard validation annotations

### Development Tools
- **Lombok** - Reduces boilerplate code with annotations
- **Spring Boot DevTools** - Development-time features

## 🗄️ Database

### Primary Database
- **MySQL 8.0+** - Relational database management system
- **InnoDB Storage Engine** - ACID-compliant storage engine
- **UTF-8 Character Set** - Unicode support

### Database Features Used
- **Foreign Key Constraints** - Data integrity
- **Indexes** - Query performance optimization
- **Auto-increment Primary Keys** - Unique identifiers
- **Timestamps** - Audit trail (created_at, updated_at)

## 🔧 Development Tools

### Version Control
- **Git** - Distributed version control system
- **GitHub** - Code hosting and collaboration platform

### IDE Support
- **IntelliJ IDEA** - Recommended Java IDE
- **Visual Studio Code** - Recommended frontend editor
- **Eclipse** - Alternative Java IDE

### Testing
- **Spring Boot Test** - Testing framework for Spring applications
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **React Testing Library** - React component testing

## 📦 Package Management

### Frontend
- **npm** - Node.js package manager
- **package.json** - Dependency management
- **package-lock.json** - Exact dependency versions

### Backend
- **Maven** - Java dependency management
- **pom.xml** - Project object model configuration
- **Maven Central Repository** - Dependency source

## 🚀 Build & Deployment

### Frontend Build
- **npm run build** - Production build with optimization
- **Static File Serving** - Deployable to any web server
- **Code Splitting** - Automatic bundle optimization

### Backend Build
- **mvn clean package** - Creates executable JAR file
- **Embedded Tomcat** - No external server required
- **Spring Boot Actuator** - Production monitoring endpoints

## 🔍 Code Quality

### Linting & Formatting
- **ESLint** - JavaScript code linting (included with React Scripts)
- **Prettier** - Code formatting (optional)
- **Checkstyle** - Java code style checking (optional)

### Security Scanning
- **npm audit** - Frontend dependency vulnerability scanning
- **OWASP Dependency Check** - Backend dependency scanning (optional)

## 🌐 API & Communication

### API Design
- **REST Architecture** - Representational State Transfer
- **JSON** - Data interchange format
- **HTTP Status Codes** - Standard response codes
- **CORS** - Cross-Origin Resource Sharing support

### Authentication
- **JWT Bearer Tokens** - Stateless authentication
- **Session Storage** - Client-side token storage
- **Authorization Headers** - Token transmission

## 📊 Performance & Monitoring

### Frontend Performance
- **React.memo** - Component memoization
- **Lazy Loading** - Code splitting for routes
- **Browser Caching** - Static asset caching

### Backend Performance
- **Connection Pooling** - Database connection management
- **JPA Query Optimization** - Efficient database queries
- **Spring Boot Actuator** - Health checks and metrics

## 🔒 Security Features

### Authentication & Authorization
- **Password Encryption** - BCrypt hashing
- **JWT Token Validation** - Stateless authentication
- **CSRF Protection** - Cross-site request forgery prevention
- **Input Validation** - Server-side data validation

### Data Protection
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization
- **User Data Isolation** - Row-level security

## 📱 Browser Support

### Frontend Compatibility
- **Chrome 90+** - Full support
- **Firefox 88+** - Full support
- **Safari 14+** - Full support
- **Edge 90+** - Full support

### Mobile Support
- **Responsive Design** - Mobile-first approach
- **Touch-friendly UI** - Mobile interaction support
- **Progressive Web App Ready** - PWA capabilities

## 🔄 Development Workflow

### Local Development
- **Hot Reloading** - Frontend development server
- **Auto-restart** - Backend development with Spring Boot DevTools
- **Live Database** - MySQL development instance

### Version Control
- **Feature Branches** - Git workflow
- **Pull Requests** - Code review process
- **Semantic Versioning** - Release management