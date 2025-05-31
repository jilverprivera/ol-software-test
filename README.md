# OL Software - Full Stack Application

This is a full-stack application developed as part of the OL Software technical test. The project consists of a Next.js frontend and a NestJS backend with PostgreSQL database.

## 🛠 Tech Stack

### Frontend
- Next.js 15.3.3
- React 19.0.0
- TypeScript 5
- TailwindCSS 4
- Zustand (state management)
- React Query
- React Hook Form
- Zod (schema validation)

### Backend
- NestJS v11
- PostgreSQL 17
- Prisma ORM
- Passport JWT
- TypeScript
- Docker Support

## 📋 Prerequisites

- Node.js (version specified in .nvmrc)
- Yarn (package manager)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## 🔧 Environment Setup

### Backend Configuration
Create a `.env` file in the `backend` directory:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ol_software_db"

# CORS configuration
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# JWT Configuration
JWT_SECRET_KEY="your-secret-key"
JWT_EXPIRES_IN="24h"
```

### Frontend Configuration
Create a `.env` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=<YOUR_API_URL>
```

## 🚀 Installation & Setup

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the database:
   ```bash
   docker-compose up -d pg-ol-software
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

## 🏃‍♂️ Running the Application

### Backend
Development mode:
```bash
cd backend && yarn start:dev
```

Production mode:
```bash
cd backend && yarn build && yarn start:prod
```

### Frontend
Development mode:
```bash
cd frontend && yarn dev
```

Production mode:
```bash
cd frontend && yarn build && yarn start
```

## 📁 Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── app/              # Application routes and pages
│   │   │   ├── components/       # Reusable components
│   │   │   ├── context/         # React contexts
│   │   │   ├── interface/       # TypeScript interfaces
│   │   │   ├── lib/            # Utilities
│   │   │   └── providers/      # Application providers
│   │   └── public/             # Static files
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── establishment/  # Establishment module
│   │   │   ├── merchant/       # Merchant module
│   │   │   ├── helpers/        # Helper functions
│   │   │   └── prisma/         # Prisma configuration
│   │   ├── prisma/
│   │   │   └── migrations/     # Database migrations
│   │   └── test/              # Test files
│   │
│   └── docker-compose.yml     # Docker configuration
│
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
yarn test          # Unit tests
yarn test:e2e     # E2E tests
yarn test:cov     # Coverage report
```

## ✍️ Author

Jilver Pacheco - [jilverpacheco@gmail.com](mailto:jilverpacheco@gmail.com) 