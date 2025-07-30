@echo off
echo 🚀 Starting NotebookLM Clone...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

:: Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
) else (
    echo ✅ Backend dependencies already installed
)

:: Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
) else (
    echo ✅ Frontend dependencies already installed
)

:: Create uploads directory
if not exist "backend\uploads" mkdir backend\uploads

echo 🎯 Starting servers...
echo 📝 Backend will start on http://localhost:5000
echo 🌐 Frontend will start on http://localhost:3000
echo.
echo To stop the servers, press Ctrl+C
echo.

:: Start backend server
echo Starting backend server...
start /B cmd /c "cd backend && npm run dev"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend server
echo Starting frontend server...
cd frontend && npm start

pause