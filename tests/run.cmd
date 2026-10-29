@echo off
rem Double-click to run the regression battery. See tests\run.mjs.
cd /d "%~dp0.."
node tests\run.mjs %*
echo.
pause
