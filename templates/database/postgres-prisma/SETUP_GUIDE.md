# PostgreSQL + Prisma Setup Guide

## 🚨 IMPORTANT: Directory Structure

Your project now has both frontend and backend:

```
your-project/
├── src/                    # Frontend (React/Vite)
├── backend/                # Backend (Node.js/Express/Prisma)
│   ├── prisma/
│   │   └── schema.prisma   # Database schema HERE
│   ├── package.json
│   └── server.js
└── package.json           # Frontend package.json
```

## 🎯 Quick Setup

### 1. Backend Setup (First!)
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Initialize database (recommended - does everything in one command)
npm run db:init

# OR run commands individually:
# npm run db:generate:force
# npm run db:migrate

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 2. Frontend Setup
```bash
# In a new terminal, go to project root
cd ..  # (back to project root)

# Install frontend dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## ⚠️ Common Issues & Windows Fixes

### "Prisma Schema not found"
- **Solution**: Make sure you're in the `backend` directory when running Prisma commands
- **Wrong**: Running `npx prisma generate` from project root
- **Correct**: Running `npm run db:generate` from `backend` directory

### Commands Hanging on Windows
- **Issue**: `npm run db:migrate` hangs without specifying migration name
- **Solution**: Use these reliable commands instead:
```bash
# Windows-specific reliable commands (run from backend directory)
.\node_modules\.bin\prisma.cmd generate
.\node_modules\.bin\prisma.cmd migrate dev --name init
.\node_modules\.bin\prisma.cmd studio
```

### PowerShell Permission Issues
- **Issue**: Scripts cannot run due to execution policy
- **Solution**: Run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### File Permission Issues with Prisma Client
- **Issue**: Cannot overwrite query engine file
- **Solution**: Use safe generation mode:
```bash
npm run db:generate:safe
```

### NPX/NPM Hanging
- **Issue**: Commands hang when using npx or npm run
- **Solution**: Use direct executable paths:
```bash
# From backend directory
.\node_modules\.bin\prisma.cmd migrate dev --name migration_name
.\node_modules\.bin\prisma.cmd generate
```

### "PrismaClient is unable to run in browser"
- **Solution**: This is already fixed! Database operations now happen in the backend
- Frontend uses API calls to communicate with backend

## 🔧 Environment Variables

### Backend (.env in backend directory)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3001
```

### Frontend (.env in project root)
```env
VITE_API_URL="http://localhost:3001/api"
```

## 📁 File Locations

- **Database Schema**: `backend/prisma/schema.prisma`
- **Prisma Commands**: Run from `backend/` directory
- **API Server**: `backend/server.js`
- **Frontend API Client**: `src/lib/api.js`

## 🚀 Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd .. && npm run dev`
3. Access app: `http://localhost:5173`
4. API available: `http://localhost:3001/api`

Both servers need to be running for the full application to work!

## 🪟 Windows-Specific Setup

### Recommended Commands for Windows
Instead of using npm scripts that might hang, use these direct commands:

```bash
# From backend directory
# 1. Generate Prisma client
.\node_modules\.bin\prisma.cmd generate

# 2. Create and run migration
.\node_modules\.bin\prisma.cmd migrate dev --name init

# 3. Seed database (if you have seed data)
node prisma/seed.js

# 4. Open Prisma Studio
.\node_modules\.bin\prisma.cmd studio
```

### Alternative: Create Batch Scripts
Create a file `db-setup.bat` in your backend directory:

```batch
@echo off
echo Setting up database...
.\node_modules\.bin\prisma.cmd generate
.\node_modules\.bin\prisma.cmd migrate dev --name init
node prisma/seed.js
echo Database setup complete!
pause
```

Then run: `db-setup.bat`

### Troubleshooting Command Hangs
If commands still hang:

1. **Kill hanging processes**: Press `Ctrl+C` to stop
2. **Clear npm cache**: `npm cache clean --force`
3. **Restart terminal**: Close and reopen your terminal
4. **Use direct paths**: Always use `.\node_modules\.bin\prisma.cmd`
5. **Check database connection**: Ensure PostgreSQL is running

### Quick Database Reset
```bash
# Complete database reset (Windows)
.\node_modules\.bin\prisma.cmd migrate reset --force
.\node_modules\.bin\prisma.cmd generate
.\node_modules\.bin\prisma.cmd migrate dev --name fresh_start
```