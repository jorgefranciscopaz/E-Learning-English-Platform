# E-Learning English Platform - Backend API

A comprehensive backend API for an English learning platform designed specifically for kids, built with Express.js, TypeScript, PostgreSQL, and JWT authentication.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control (student, teacher, admin)
- **User Management**: Registration, login, profile management
- **Lesson Management**: CRUD operations for educational content
- **Progress Tracking**: Track student progress through lessons
- **Quiz System**: Interactive quizzes for lessons
- **Security**: Rate limiting, CORS, helmet protection, password hashing
- **Database**: PostgreSQL with Sequelize ORM
- **Docker Support**: Containerized development environment

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Docker, Docker Compose with hot reload

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   └── lessonController.ts  # Lesson management logic
│   ├── middleware/
│   │   └── auth.ts             # JWT authentication middleware
│   ├── models/
│   │   └── index.ts            # Sequelize models (User, Lesson, Progress, Quiz)
│   ├── routes/
│   │   ├── auth.ts             # Authentication routes
│   │   ├── lessons.ts          # Lesson routes
│   │   └── index.ts            # Main router
│   ├── types/
│   │   └── models.ts           # TypeScript interfaces
│   └── index.ts                # Main application entry point
├── docker-compose.yml          # Docker services configuration
├── Dockerfile                  # Docker build instructions
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── .env                      # Environment variables
```

## 🚦 Quick Start

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development environment**
   ```bash
   # Start everything with hot reload
   docker-compose up --build --watch
   ```

   This single command will:
   - Start PostgreSQL database
   - Build and run the backend with hot reload
   - Watch for file changes and sync automatically

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Remove build directory

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Lessons
- `GET /api/lessons` - Get all lessons (protected)
- `GET /api/lessons/:id` - Get lesson by ID (protected)
- `POST /api/lessons` - Create lesson (teacher/admin only)
- `PUT /api/lessons/:id` - Update lesson (teacher/admin only)
- `DELETE /api/lessons/:id` - Delete lesson (admin only)

### Health Check
- `GET /api/health` - API health status
- `GET /` - Welcome message

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Student**: Can view lessons and track progress
- **Teacher**: Can create and edit lessons
- **Admin**: Full access to all resources

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `role` (Enum: student, teacher, admin)
- `age` (Integer, Optional)
- `level` (String, Optional)
- `createdAt`, `updatedAt` (Timestamps)

### Lessons Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `content` (Text)
- `level` (String)
- `category` (String)
- `duration` (Integer)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Progress Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `lessonId` (UUID, Foreign Key)
- `completed` (Boolean)
- `score` (Integer)
- `timeSpent` (Integer)
- `createdAt`, `updatedAt` (Timestamps)

### Quizzes Table
- `id` (UUID, Primary Key)
- `lessonId` (UUID, Foreign Key)
- `title` (String)
- `questions` (JSONB)
- `createdAt`, `updatedAt` (Timestamps)

## 🐳 Docker Development

The project includes Docker support with hot reload for development:

```yaml
# docker-compose.yml includes:
- PostgreSQL database on port 5432
- Backend API on port 5000
- Automatic file watching and reload
- Volume mounting for development
```

To use Docker for development:
```bash
docker-compose up --build
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   # Update database credentials
   # Use strong JWT secret
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## 📝 Environment Variables

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elearning_english
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=24h
BCRYPT_ROUNDS=12
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🎯 Hackathon Ready

This backend is fully configured and ready for hackathon development with:
- Complete authentication system
- Database models and relationships
- RESTful API endpoints
- Docker development environment
- Security best practices
- TypeScript for better development experience

Perfect foundation for building an English learning platform for kids! 🎓✨