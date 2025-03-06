#!/bin/sh

# Запуск міграцій
echo "Running migrations..."
npx prisma migrate deploy

# Запуск додатку
echo "Starting application..."
node dist/src/main.js 