# E-Learning API Testing Guide

## 🚀 Quick Start

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Access Swagger Documentation**:
   - Open your browser and go to: http://localhost:5000/api-docs
   - This provides interactive API testing interface

3. **API Base URL**: http://localhost:5000/api

## 🔐 Authentication Flow

### Step 1: Register or Login

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "rol": "estudiante",
    "nombre": "Test",
    "apellido": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "testuser",
    "password": "password123"
  }'
```

**Response includes JWT token:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "usuario": "testuser",
    "rol": "estudiante"
  }
}
```

### Step 2: Use JWT Token for Protected Routes

Include the token in the `Authorization` header:
```bash
curl -X GET http://localhost:5000/api/usuarios/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 👥 User Roles & Permissions

### 🎓 **estudiante** (Student)
- ✅ View own profile
- ✅ View niveles, modulos, lecciones
- ✅ Create/update own progress
- ✅ View own progress statistics
- ❌ Cannot manage users, classes, or curriculum

### 👨‍🏫 **docente** (Teacher)
- ✅ All student permissions
- ✅ Create and manage own classes
- ✅ Enroll/unenroll students
- ✅ Create/edit modulos and lecciones
- ✅ View student progress in their classes
- ❌ Cannot delete modulos/lecciones or manage other teachers

### 🔧 **admin** (Administrator)
- ✅ All permissions
- ✅ Manage all users, classes, curriculum
- ✅ Delete any resource
- ✅ View all data

## 🧪 Testing Restricted Routes

### Test 1: Access Protected Route Without Token
```bash
curl -X GET http://localhost:5000/api/usuarios/profile
# Expected: 401 Unauthorized
```

### Test 2: Access Admin-Only Route as Student
```bash
# First login as student
TOKEN=$(curl -s -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"usuario": "student1", "password": "student123"}' | \
  jq -r '.token')

# Try to access admin route
curl -X GET http://localhost:5000/api/usuarios \
  -H "Authorization: Bearer $TOKEN"
# Expected: 403 Forbidden
```

### Test 3: Teacher Creating Classes
```bash
# Login as teacher
TOKEN=$(curl -s -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"usuario": "teacher1", "password": "teacher123"}' | \
  jq -r '.token')

# Create a class
curl -X POST http://localhost:5000/api/clases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "TEST001",
    "nombre": "Test Class",
    "grado": "1ro",
    "seccion": "A",
    "jornada": "Mañana"
  }'
```

### Test 4: Student Progress Tracking
```bash
# Login as student
TOKEN=$(curl -s -X POST http://localhost:5000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"usuario": "student1", "password": "student123"}' | \
  jq -r '.token')

# Update progress
curl -X POST http://localhost:5000/api/progresos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leccion_id": 1,
    "completado": true,
    "puntaje": 85
  }'

# View own progress
curl -X GET http://localhost:5000/api/progresos/my \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Pre-seeded Test Data

The database is automatically seeded with test data on startup:

### Users:
- **admin** / admin123 (Admin)
- **teacher1** / teacher123 (Teacher - María González)
- **teacher2** / teacher123 (Teacher - Carlos Rodríguez)
- **student1** / student123 (Student - Ana López)
- **student2** / student123 (Student - Pedro Martínez)
- **student3** / student123 (Student - Sofia Hernández)

### Classes:
- CLASE001: Inglés Básico - Grupo A (Ana, Pedro)
- CLASE002: Inglés Básico - Grupo B (Sofia)
- CLASE003: Inglés Intermedio - Grupo A

### Curriculum:
- **Niveles**: 1A, 1B, 2A, 2B, 3A, 3B
- **Modulos**: Abecedario, Números, Vocales, Colores, etc.
- **Lecciones**: 4 lessons per module (Intro, Vocabulary, Practice, Evaluation)

## 🔍 Common API Endpoints

### Authentication
- `POST /api/usuarios/register` - Register user
- `POST /api/usuarios/login` - Login user
- `GET /api/usuarios/profile` - Get current user profile

### User Management (Admin only)
- `GET /api/usuarios` - List all users
- `GET /api/usuarios/:id` - Get user by ID
- `PUT /api/usuarios/:id` - Update user
- `DELETE /api/usuarios/:id` - Delete user

### Classes (Admin/Teacher)
- `POST /api/clases` - Create class
- `GET /api/clases` - List classes
- `PUT /api/clases/:id` - Update class
- `POST /api/clases/:id/enroll` - Enroll student

### Curriculum
- `GET /api/niveles` - List levels
- `GET /api/modulos` - List modules
- `GET /api/lecciones` - List lessons
- `POST /api/lecciones` - Create lesson (Admin/Teacher)

### Progress (Students)
- `POST /api/progresos` - Update progress
- `GET /api/progresos/my` - Get my progress
- `GET /api/progresos/stats` - Get progress statistics

## 🐛 Error Response Format

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

### Common Error Codes:
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

## 🛠️ Using Swagger UI

1. Go to http://localhost:5000/api-docs
2. Click "Authorize" button
3. Enter: `Bearer YOUR_JWT_TOKEN`
4. Test endpoints directly in the interface

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema documentation
- Authentication testing

## 📝 Testing Checklist

- [ ] Register new user successfully
- [ ] Login with valid credentials
- [ ] Access protected route with valid token
- [ ] Get 401 error without token
- [ ] Get 403 error with insufficient permissions
- [ ] Admin can access all endpoints
- [ ] Teacher can manage own classes
- [ ] Student can only access own data
- [ ] Progress tracking works correctly
- [ ] Swagger documentation loads properly

## 🔄 Development Workflow

1. Start server: `npm run dev`
2. Use Swagger UI for initial testing: http://localhost:5000/api-docs
3. Use curl/Postman for automated testing
4. Check logs for authentication errors
5. Use different user roles to test permissions

Happy testing! 🎉