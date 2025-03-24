#!/bin/bash

# Install root dependencies
npm install

# Install shared package dependencies
cd packages/shared
npm install
cd ../..

# Install config package dependencies
cd packages/config
npm install
cd ../..

# Install backend dependencies
cd apps/backend
npm install
cd ../..

# Install frontend dependencies (will create later)
# cd apps/frontend
# npm install
# cd ../..

# Build packages in correct order
npm run build

echo "Setup complete! 🎉"
echo "To start development:"
echo "1. Copy apps/backend/.env.example to apps/backend/.env and fill in your values"
echo "2. Run 'npm run dev' to start all services in development mode"