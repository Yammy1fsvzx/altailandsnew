#!/bin/sh

# Ждем, пока PostgreSQL будет готов
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Запускаем миграции
echo "Running database migrations..."
npx prisma migrate deploy

# Запускаем сидинг, если нужно
if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database..."
  npm run seed
fi

# Запускаем приложение
echo "Starting the application..."
npm run start 