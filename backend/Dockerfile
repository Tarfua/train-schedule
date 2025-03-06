# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build essentials
RUN apk add --no-cache python3 make g++

# Debug: Show initial state
RUN echo "=== Initial directory state ===" && \
    pwd && \
    ls -la

# Copy ALL config files first
COPY package*.json tsconfig*.json nest-cli.json .prettierrc ./

# Debug: Verify config files
RUN echo "=== After copying config files ===" && \
    ls -la && \
    echo "=== Content of tsconfig.json ===" && \
    cat tsconfig.json || echo "tsconfig.json not found!"

# Install dependencies
RUN npm ci

# Copy source files
COPY src/ ./src/
COPY prisma/ ./prisma/

# Debug: Verify source files
RUN echo "=== After copying source files ===" && \
    ls -la && \
    ls -la src/

# Copy remaining files
COPY . .

# Final debug check
RUN echo "=== Final state ===" && \
    ls -la && \
    echo "=== Content of tsconfig.json ===" && \
    cat tsconfig.json || echo "tsconfig.json not found!"

# Show environment info
RUN node -v && npm -v && ls -la

# Generate Prisma client
RUN npx prisma generate

# Build with NestJS CLI
RUN npm run build \
    || (echo "=== Build failed ===" \
    && echo "=== Directory structure ===" \
    && ls -la \
    && echo "=== Content of tsconfig.json ===" \
    && cat tsconfig.json \
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