@echo off
title Discord Custom Rich Presence
cd /d "%~dp0"

echo Starting Discord Custom Rich Presence...
echo.

npm start
set EXIT_CODE=%ERRORLEVEL%

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Script exited with error code %EXIT_CODE%.
  echo Press any key to close...
  pause >nul
)
