# Backend API Test Script
# Run this to verify the backend is working correctly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend API Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "Test 1: Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/users" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ Backend is running!" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Backend is NOT running!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the backend server:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    exit 1
}

Write-Host ""

# Test 2: Check GET /api/users
Write-Host "Test 2: Testing GET /api/users..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/users" -Method GET -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✓ GET /api/users works!" -ForegroundColor Green
        Write-Host "  Found $($data.users.Count) users" -ForegroundColor Gray
    } else {
        Write-Host "✗ GET /api/users returned success=false" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ GET /api/users failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Check POST /api/users
Write-Host "Test 3: Testing POST /api/users..." -ForegroundColor Yellow
$randomEmail = "test$(Get-Random)@example.com"
$body = @{
    firstName = "Test"
    lastName = "User"
    email = $randomEmail
    phone = "+977 9801234567"
    role = "tenant"
    status = "active"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/users" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✓ POST /api/users works!" -ForegroundColor Green
        Write-Host "  Created user: $($data.user.firstName) $($data.user.lastName)" -ForegroundColor Gray
        Write-Host "  Email: $($data.user.email)" -ForegroundColor Gray
        Write-Host "  Role: $($data.user.role)" -ForegroundColor Gray
    } else {
        Write-Host "✗ POST /api/users returned success=false" -ForegroundColor Red
        Write-Host "  Message: $($data.message)" -ForegroundColor Red
    }
} catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -like "*Cannot POST*") {
        Write-Host "✗ POST /api/users endpoint NOT FOUND!" -ForegroundColor Red
        Write-Host "  This means the backend server needs to be RESTARTED" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "SOLUTION:" -ForegroundColor Cyan
        Write-Host "  1. Stop the backend server (Ctrl+C)" -ForegroundColor White
        Write-Host "  2. Restart it: npm start" -ForegroundColor White
        Write-Host "  3. Run this test script again" -ForegroundColor White
    } else {
        Write-Host "✗ POST /api/users failed!" -ForegroundColor Red
        Write-Host "  Error: $errorMessage" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
