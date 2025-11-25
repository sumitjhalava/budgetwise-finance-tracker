# Contributing to BudgetWise

Thank you for contributing!

## 🔥 Branching Strategy
- `main` → stable production code  
- `develop` → integration branch  
- `feat/<name>` → new features  
- `fix/<name>` → bug fixes

## 🔥 Pull Request Rules
- Create PRs **into `develop`**
- Add a clear summary, screenshots (if UI), and linked issue ID
- At least **1 approval required** before merge
- Squash merge preferred

## 🔥 Code Style
### Backend (Spring Boot)
- Use standard Java conventions
- Follow layered architecture (Controller → Service → Repository)

### Frontend (React)
- Functional components only
- Follow ESLint + Prettier formatting

## 🔥 Commit Message Format


feat: add new transaction API
fix: resolve JWT expiry bug
docs: update README
chore: cleanup files


## 🔥 How to Run Locally
Backend:


./mvnw spring-boot:run


Frontend:


npm install
npm run dev


Happy coding! 🎉
