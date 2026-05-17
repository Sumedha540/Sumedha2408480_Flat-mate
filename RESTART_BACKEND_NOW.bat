@echo off
echo ========================================
echo RESTARTING BACKEND SERVER
echo ========================================
echo.
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting backend server with nodemon (auto-restart)...
cd backend
start cmd /k "npm run dev"
echo.
echo Backend server is starting in a new window...
echo Nodemon will auto-restart on file changes.
echo Wait 5 seconds for it to fully start, then test Add User again.
echo.
pause
