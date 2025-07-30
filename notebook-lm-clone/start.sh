#!/bin/bash

echo "🚀 Starting NotebookLM Clone..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if node_modules don't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
else
    echo "✅ Backend dependencies already installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
else
    echo "✅ Frontend dependencies already installed"
fi

# Create uploads directory if it doesn't exist
mkdir -p backend/uploads

echo "🎯 Starting servers..."
echo "📝 Backend will start on http://localhost:5000"
echo "🌐 Frontend will start on http://localhost:3000"
echo ""
echo "To stop the servers, press Ctrl+C"
echo ""

# Start both servers
if command -v concurrently &> /dev/null; then
    npx concurrently "cd backend && npm run dev" "cd frontend && npm start"
else
    echo "Starting backend server..."
    cd backend && npm run dev &
    BACKEND_PID=$!
    echo "Backend server started with PID: $BACKEND_PID"
    
    echo "Starting frontend server..."
    cd ../frontend && npm start &
    FRONTEND_PID=$!
    echo "Frontend server started with PID: $FRONTEND_PID"
    
    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID
fi