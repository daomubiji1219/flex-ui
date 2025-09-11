@echo off
REM Windows pre-commit hook wrapper for Husky

pnpm exec lint-staged
if errorlevel 1 (
  echo lint-staged failed
  exit /b 1
)
exit /b 0