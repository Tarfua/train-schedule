# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy prisma files and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and configuration files
COPY . .

# Build application
RUN npm run build
RUN ls -la dist/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

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