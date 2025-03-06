# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build essentials
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install ALL dependencies first (including dev dependencies)
RUN npm ci

# Copy prisma files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and configuration files
COPY . .

# Debug information
RUN npm config list
RUN node -v
RUN npm -v
RUN ls -la

# Build application with increased memory limit and verbose output
RUN npm run build --verbose

# Check build output
RUN ls -la dist/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production --ignore-scripts

# Copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client in production
RUN npx prisma generate

# Copy environment file
COPY .env.production .env

EXPOSE 5000

# Use node directly instead of npm
CMD ["node", "dist/src/main.js"]