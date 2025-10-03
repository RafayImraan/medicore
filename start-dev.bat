@echo off
echo Starting Healthcare Management System...

REM Start the server in the background
cd server
start "Server" cmd /c "npm start"

REM Wait a moment for server to start
timeout /t 3 /nobreak > nul

REM Start the client
cd ../client
start "Client" cmd /c "npm run dev"

echo Both server and client are starting...
echo Server will be available at http://localhost:5000
echo Client will be available at http://localhost:5173
