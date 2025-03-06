# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build essentials
RUN apk add --no-cache python3 make g++

# Copy configuration files first
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Show environment info
RUN node -v && npm -v

# Install dependencies
RUN npm ci

# Copy source and prisma files
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Copy remaining files
COPY . .

# Build with NestJS CLI
RUN npm run build \
    || (echo "=== Build failed ===" \
    && echo "=== nest-cli.json ===" \
    && cat nest-cli.json \
    && echo "=== tsconfig.json ===" \
    && cat tsconfig.json \
    && echo "=== Directory structure ===" \
    && ls -la \
    && echo "=== src directory ===" \
    && ls -la src \
    && echo "=== NPM Debug Log ===" \
    && find /root/.npm/_logs -type f -exec cat {} \; \
    && exit 1)

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma files
COPY prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy built application
COPY --from=builder /app/dist ./dist

# Generate Prisma client in production
RUN npx prisma generate

# Copy environment file if exists
RUN if [ -f .env.production ]; then cp .env.production .env; fi

EXPOSE 5000

# Use node directly instead of npm
CMD ["node", "dist/src/main.js"]