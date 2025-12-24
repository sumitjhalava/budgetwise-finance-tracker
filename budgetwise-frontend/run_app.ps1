$ErrorActionPreference = "Stop"

Write-Host "Starting BudgetWise Application..." -ForegroundColor Cyan

# Check requirement: MySQL
Write-Host "NOTE: Ensure you have MySQL running on localhost:3306 with database 'budgetwise'." -ForegroundColor Yellow
Write-Host "Credentials from application.properties: User='budgetwise_user', Pass='Bhavya@98'" -ForegroundColor Yellow

# Start Backend
Write-Host "Launching Backend Server..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; ./mvnw spring-boot:run"

# Wait a bit for backend to initialize (optional, but helps)
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Launching Frontend Server..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host "Both servers launched in separate windows." -ForegroundColor Cyan
