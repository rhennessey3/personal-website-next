# Use Node.js LTS as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json files for the monorepo
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the source code
COPY packages/shared ./packages/shared
COPY packages/config ./packages/config
COPY apps/backend ./apps/backend

# Build the shared package first
RUN cd packages/shared && pnpm build

# Build the backend
RUN cd apps/backend && pnpm build

# Set the working directory to the backend
WORKDIR /app/apps/backend

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD ["node", "dist/server.js"]