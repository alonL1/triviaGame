@echo off
echo.
echo ===============================================
echo    🤖 OPENAI API SETUP 🤖
echo ===============================================
echo.
echo This script will help you configure OpenAI integration
echo for your Trivia Showdown game.
echo.
echo Step 1: Get your OpenAI API Key
echo ----------------------------------------
echo 1. Go to: https://platform.openai.com/api-keys
echo 2. Sign in or create an account
echo 3. Click "Create new secret key"
echo 4. Copy the key (starts with sk-...)
echo.
echo Step 2: Enter your API key
echo ----------------------------------------
set /p api_key="Paste your OpenAI API key here: "

if "%api_key%"=="" (
    echo Error: No API key provided!
    pause
    exit /b 1
)

echo.
echo Step 3: Updating configuration...
echo ----------------------------------------

REM Update the config.env file
powershell -Command "(Get-Content 'config.env') -replace 'OPENAI_API_KEY=your_openai_api_key_here', 'OPENAI_API_KEY=%api_key%' | Set-Content 'config.env'"

echo ✅ Configuration updated successfully!
echo.
echo Step 4: Restart the server
echo ----------------------------------------
echo Your API key has been saved to config.env
echo.
echo To use OpenAI integration:
echo 1. Stop the current server (Ctrl+C)
echo 2. Restart with: npm start
echo 3. The server will now use OpenAI for question generation!
echo.
echo 💰 Cost Information:
echo - GPT-3.5-turbo costs about $0.001-0.002 per game
echo - Each game generates 5 questions
echo - Very affordable for personal use!
echo.

pause