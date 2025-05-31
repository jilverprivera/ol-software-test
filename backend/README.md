# OL Software Backend

Backend service for the OL Software technical test, built with NestJS, PostgreSQL, and Prisma.

## 🛠 Tech Stack

- **Framework:** NestJS v11
- **Database:** PostgreSQL 17
- **ORM:** Prisma
- **Authentication:** Passport JWT
- **Language:** TypeScript
- **Docker Support:** Yes

## 📋 Prerequisites

- Node.js (version specified in .nvmrc)
- Docker and Docker Compose
- PostgreSQL (if running locally)
- yarn package manager

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ol_software_db"

# CORS configuration
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# JWT Configuration
JWT_SECRET_KEY="your-secret-key"
JWT_EXPIRES_IN="24h"
```

## 🚀 Installation

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Set up environment variables:
   ```bash
   cp env.example .env
   ```
3. Start the database using Docker:
   ```bash
   docker-compose up -d pg-ol-software
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
yarn start:dev
```

### Production Mode
```bash
yarn build
yarn start:prod
```

### Debug Mode
```bash
yarn start:debug
```

## 🐳 Docker Support

The application includes Docker configuration for both development and production environments.

### Docker Compose Configuration

```yaml
services:
  # API Service (commented out by default)
  api:
    container_name: api-ol-software
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_USER=postgres
      - DATABASE_PASSWORD=postgres
      - DATABASE_NAME=ol_software_db

  # PostgreSQL Service
  pg-ol-software:
    image: postgres:17-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=ol_software_db
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
yarn test

# e2e tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📚 Available Scripts

- `yarn build`: Build the application
- `yarn format`: Format code using Prettier
- `yarn lint`: Lint code using ESLint
- `yarn test`: Run tests
- `yarn test:watch`: Run tests in watch mode
- `yarn test:cov`: Generate test coverage report
- `yarn test:debug`: Debug tests
- `yarn test:e2e`: Run end-to-end tests

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── establishment/  # Establishment module
│   ├── merchant/       # Merchant module
│   ├── helpers/        # Helper functions
│   └── prisma/         # Prisma configuration
├── prisma/
│   └── migrations/     # Database migrations
├── test/              # Test files
└── docker-compose.yml # Docker configuration
```

## ✍️ Author

Jilver Pacheco - [jilverpacheco@gmail.com](mailto:jilverpacheco@gmail.com)
