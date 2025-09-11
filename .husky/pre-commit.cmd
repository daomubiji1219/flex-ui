@echo off
REM Windows pre-commit hook wrapper for Husky

echo Running tests before commit...
pnpm run test:run
if errorlevel 1 (
  echo Tests failed, commit aborted
  exit /b 1
)

echo Tests passed, running lint-staged...
pnpm exec lint-staged
if errorlevel 1 (
  echo lint-staged failed
  exit /b 1
)
exit /b 0