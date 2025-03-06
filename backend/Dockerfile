# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build essentials
RUN apk add --no-cache python3 make g++

# Copy all files
COPY . .

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build with NestJS CLI
RUN npm run build

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

# Copy start script and make it executable
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8080

# Use start.sh script
CMD ["./start.sh"]
