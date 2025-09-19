# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Environment:**
```bash
docker-compose up --build --watch
```
This starts both PostgreSQL database and backend with hot reload. The API runs on http://localhost:5000.

**Available npm scripts:**
- `npm run dev` - Start development server with nodemon (if running locally)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Remove build directory

## Architecture Overview

This is an **E-Learning English Platform Backend API** designed for kids, built with Express.js, TypeScript, and PostgreSQL.

### Database Design Pattern
The project uses a **single-file database pattern** where all Sequelize models are defined in `src/database.ts`. This includes:
- Database configuration and connection
- All model definitions (User, Lesson, Progress, Quiz)
- Model relationships and associations
- TypeScript interfaces for model attributes

### Authentication & Authorization
- **JWT-based authentication** with role-based access control
- Three user roles: `student`, `teacher`, `admin`
- Authentication middleware in `src/middleware/auth.ts`
- Hardcoded JWT secret for development: `'your_super_secret_jwt_key_change_in_production'`

### API Structure
Base path: `/api`
- `/api/auth/*` - Authentication endpoints (register, login, profile)
- `/api/lessons/*` - Lesson management (CRUD with role permissions)
- `/api/health` - Health check endpoint

**Role Permissions:**
- Students: Can view lessons and track progress
- Teachers: Can create and edit lessons
- Admins: Full access to all resources

### Key Files
- `src/database.ts` - Single file containing all models and database config
- `src/index.ts` - Express app setup with middleware and server start
- `src/routes/index.ts` - Main router that aggregates all route modules
- `src/controllers/` - Business logic for authentication and lessons
- `src/middleware/auth.ts` - JWT authentication and role-based authorization

### Docker Configuration
- Full containerized development with hot reload
- PostgreSQL database with health checks
- File watching and auto-sync for development
- Environment variables configured in docker-compose.yml

### Database Models
- **User**: Authentication, profile info, role-based access
- **Lesson**: Educational content with level/category filtering
- **Progress**: Student progress tracking per lesson
- **Quiz**: Interactive quizzes linked to lessons

The codebase prioritizes rapid development and hackathon-style iteration with a pragmatic single-file database approach.