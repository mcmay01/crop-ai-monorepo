# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace manifests so npm can resolve the shared-types workspace
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
COPY packages/shared-types/package.json packages/shared-types/
COPY apps/mobile/package.json apps/mobile/

# Install only the workspaces the backend needs
RUN npm install --workspace=apps/backend --workspace=packages/shared-types

# Copy sources
COPY packages/shared-types packages/shared-types
COPY apps/backend apps/backend

# Build shared types first (the backend imports its types)
RUN npm run build --workspace=packages/shared-types
RUN npm run build --workspace=apps/backend

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
