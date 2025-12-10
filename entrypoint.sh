#!/bin/sh

echo "⏳ Waiting for PostgreSQL to be ready..."

# Esperar hasta que la BD acepte conexiones
until nc -z $DB_HOST $DB_PORT; do
  echo "⏳ Waiting for Postgres ($DB_HOST:$DB_PORT)..."
  sleep 2
done

echo "⚙️ Generating Prisma Client..."
npx prisma generate

echo "📦 Deploying Prisma migrations..."
npx prisma migrate deploy

echo "🚀 Starting server..."
node server
