# Contributing to BudgetWise Finance Tracker

Thank you for your interest in contributing to BudgetWise Finance Tracker! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/budgetwise-finance-tracker.git
   cd budgetwise-finance-tracker
   ```

2. **Set up the backend**
   ```bash
   cd backend
   # Configure your database in application.properties
   mvn spring-boot:run
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📋 How to Contribute

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Provide detailed information about the issue
- Include steps to reproduce for bugs
- Check existing issues before creating new ones

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Write tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Backend tests
   cd backend && mvn test
   
   # Frontend tests
   cd frontend && npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### Backend (Java/Spring Boot)
- Follow Java naming conventions
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods small and focused
- Use Spring Boot best practices

### Frontend (React/JavaScript)
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Keep components small and reusable
- Use proper error handling

### Database
- Use descriptive table and column names
- Follow naming conventions (snake_case)
- Add proper indexes for performance
- Use foreign key constraints

## 🧪 Testing Guidelines

### Backend Testing
- Write unit tests for services and repositories
- Use integration tests for controllers
- Test security configurations
- Aim for good test coverage

### Frontend Testing
- Test component rendering
- Test user interactions
- Test API integration
- Use React Testing Library

## 📚 Documentation

- Update README.md for significant changes
- Update API documentation for new endpoints
- Add inline comments for complex logic
- Update architecture docs for structural changes

## 🔍 Code Review Process

1. **Pull Request Requirements**
   - Clear description of changes
   - Link to related issues
   - All tests passing
   - No merge conflicts

2. **Review Criteria**
   - Code quality and standards
   - Test coverage
   - Documentation updates
   - Security considerations

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment**: OS, Java version, Node.js version
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable

## 💡 Feature Requests

For new features:
- Describe the problem you're solving
- Explain the proposed solution
- Consider alternative approaches
- Discuss potential impact

## 📋 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

## 🏷️ Commit Message Format

Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Ask questions if unsure

## 📞 Getting Help

- Create an issue for questions
- Join discussions in pull requests
- Check existing documentation
- Review similar implementations

## 🎉 Recognition

Contributors will be:
- Listed in the project contributors
- Mentioned in release notes
- Credited for significant contributions

Thank you for contributing to BudgetWise Finance Tracker!