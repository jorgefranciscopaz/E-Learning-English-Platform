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

## Project Requirements Summary

This is an **E-Learning English Platform for Kids (3-9 years old)** targeting primary education in Honduran public schools. The platform enables semi-autonomous English learning with teacher supervision.

### Core Requirements from PDF:
1. **Target Audience**: Kids aged 3-9 (kindergarten to 4th grade) in Honduran public schools
2. **Application Type**: Web application (PWA preferred) with responsive design
3. **Authentication**: Username/password only, teachers create student accounts
4. **User Roles**: `estudiante` (student), `docente` (teacher), `admin` (administrator)
5. **Required Learning Modules**:
   - Alphabet (Abecedario)
   - Numbers (Números)
   - Vowels (Vocales)
   - Colors (Colores)
   - Days of the week (Días de la semana)
   - Months of the year (Meses del año)
   - Animals (Animales)

### Missing Features Analysis:
- **Evaluation System**: Need quiz/test functionality with minimum 5 questions per module
- **Class Management**: Teachers need ability to create classes with codes and manage multiple classes
- **Student Bulk Registration**: Excel upload feature for batch student creation
- **Progress Reports**: PDF/Word export functionality for individual and class-wide reports
- **Module Locking**: Sequential module progression (must complete previous modules to unlock next)
- **AI Content Generation**: Dynamic content creation based on curriculum templates

## Architecture Overview

Built with Express.js, TypeScript, and PostgreSQL using a single-file database pattern.

### Database Design Pattern
All Sequelize models are defined in `src/database/database.ts` including:
- Database configuration and connection
- Model definitions: Usuario, Clase, ClaseEstudiante, Nivel, Modulo, Leccion, Progreso, Reporte
- Model relationships and associations
- Password hashing with bcrypt hooks

### Authentication & Authorization
- **JWT-based authentication** with role-based access control
- Three user roles: `admin`, `docente`, `estudiante` (Spanish naming per requirements)
- Authentication middleware in `src/middleware/auth.ts`
- Hardcoded JWT secret for development: `'your_super_secret_jwt_key_change_in_production'`

### Current API Structure
Base path: `/api`
- `/api/auth/*` - Authentication endpoints (register, login, profile)
- `/api/usuarios/*` - User management
- `/api/clases/*` - Class management 
- `/api/niveles/*` - Level management
- `/api/modulos/*` - Module management
- `/api/lecciones/*` - Lesson management
- `/api/progresos/*` - Progress tracking
- `/api/health` - Health check endpoint

**Role Permissions (Per Requirements):**
- **Admin**: Full access to all resources
- **Docente**: Access to teacher module, can create classes, view student progress, manage own classes
- **Estudiante**: Access only to learning modules, cannot create accounts (teacher-created only)

### Key Files
- `src/database/database.ts` - All models and database configuration
- `src/index.ts` - Express app setup with middleware and server start
- `src/routes/index.ts` - Main router aggregating all route modules
- `src/controllers/` - Business logic for all modules
- `src/middleware/auth.ts` - JWT authentication and role-based authorization

### Docker Configuration
- Full containerized development with hot reload
- PostgreSQL database with health checks
- File watching and auto-sync for development
- Environment variables configured in docker-compose.yml

### Current Database Models
- **Usuario**: User authentication with roles (admin/docente/estudiante)
- **Clase**: Teacher-managed classes with unique codes
- **ClaseEstudiante**: Many-to-many relationship between classes and students
- **Nivel**: English levels (1A, 1B as mentioned in requirements)
- **Modulo**: Learning modules within levels (Alphabet, Numbers, etc.)
- **Leccion**: Individual lessons within modules with JSON content
- **Progreso**: Student progress tracking per lesson with completion status
- **Reporte**: Progress reports for export functionality

### Implementation Gaps vs Requirements:
1. **Missing Authentication Flow**: Current auth controller doesn't match Spanish field names in database
2. **Missing Evaluation System**: No quiz/test models or endpoints
3. **Missing Bulk Registration**: No Excel upload functionality for student creation
4. **Missing Report Generation**: No PDF/Word export capabilities
5. **Missing Content AI**: No AI content generation based on curriculum templates
6. **Missing Module Progression**: No enforcement of sequential module completion

The codebase provides a solid foundation but requires significant additions to meet the full requirements specification.