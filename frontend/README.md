# OL Software Frontend

This is the frontend of the OL Software application, developed with Next.js 15, React 19, TypeScript, and TailwindCSS.

## Prerequisites

- Node.js (recommended version: 18.x or higher)
- Yarn (as package manager)

## Main Technologies

- Next.js 15.3.3
- React 19.0.0
- TypeScript 5
- TailwindCSS 4
- Zustand (state management)
- React Query (server data management)
- React Hook Form (form handling)
- Zod (schema validation)

## Installation

1. Install dependencies:

```bash
yarn install
```

2. Copy the environment variables file:

```bash
cp env_example .env
```

3. Configure environment variables in the `.env` file:

```env
NEXT_PUBLIC_API_URL=<YOUR_API_URL>
```

## 📚 Available Scripts

- `yarn dev`: Starts the development server with Turbopack
- `yarn build`: Builds the application for production
- `yarn start`: Starts the production server
- `yarn lint`: Runs the linter to check the code

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Application routes and pages
│   │   ├── (auth)/            # Authentication routes
│   │   └── (private)/         # Private routes
│   ├── components/            # Reusable components
│   │   ├── auth/             # Authentication components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── context/              # React contexts
│   ├── interface/            # TypeScript interfaces and types
│   ├── lib/                  # Utilities and configurations
│   └── providers/            # Application providers
├── public/                   # Static files
└── ...                      # Configuration files
```

## ✍️ Author

Jilver Pacheco - [jilverpacheco@gmail.com](mailto:jilverpacheco@gmail.com)
