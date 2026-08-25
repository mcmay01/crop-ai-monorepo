# Use Node.js 22 LTS
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root package files first for better caching
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared-types/package*.json ./packages/shared-types/ 2>/dev/null || true

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the backend
RUN npm run build --workspace=apps/backend

# ---------- Production image ----------
FROM node:22-alpine

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["node", "dist/main.js"]