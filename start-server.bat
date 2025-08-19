@echo off
echo.
echo ===============================================
echo    🧠 TRIVIA SHOWDOWN SERVER 🧠
echo ===============================================
echo.
echo Starting the trivia game server...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    cmd /c "npm install"
    echo.
)

echo Starting server on http://localhost:3000
echo.
echo 🎮 Controls:
echo    Player 1: W/A/S/D keys
echo    Player 2: Arrow keys
echo.
echo 🚀 Open your browser and go to:
echo    http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cmd /c "npm start"

pause