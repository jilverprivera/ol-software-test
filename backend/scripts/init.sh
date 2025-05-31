#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
/app/wait-for-it.sh postgres:5432 -t 20

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Run database seed
echo "Running database seed..."
npx prisma db seed

# Start the application
echo "Starting the application..."
yarn start:prod 