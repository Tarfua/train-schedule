# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with specific NPM flags for optimization
RUN npm ci --only=production
RUN npm ci

# Copy prisma files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and configuration files
COPY . .

# Build application with increased memory limit
RUN NODE_OPTIONS="--max_old_space_size=2048" npm run build
RUN ls -la dist/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies with specific NPM flags
RUN npm ci --only=production --no-optional

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