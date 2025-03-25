# Railway Deployment Guide

This guide explains how to deploy the backend of your personal website to Railway.

## Changes Made

We've made the following changes to fix the Railway deployment issues:

1. **Created a Dockerfile for the backend**
   - Located at `apps/backend/Dockerfile`
   - Installs pnpm and sets up the monorepo structure
   - Builds the shared package and backend
   - Exposes port 8080 and starts the server

2. **Created a Railway configuration file**
   - Located at `apps/backend/railway.json`
   - Tells Railway to use the Dockerfile for deployment
   - Sets restart policy for the service

3. **Fixed environment variable mismatch**
   - Updated `apps/backend/src/server.ts` to use `CORS_ORIGIN` instead of `FRONTEND_URL`
   - Updated environment files with correct URLs:
     - `apps/backend/.env.production`: Set `CORS_ORIGIN` to your Vercel frontend URL
     - `apps/frontend/.env.production`: Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
     - `apps/frontend/vercel.json`: Updated API URL in both env and routes sections

4. **Updated CI/CD workflow**
   - Uncommented the Railway deployment section in `.github/workflows/ci-cd.yml`

## Deployment Steps

### 1. Manual Deployment to Railway

1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   cd apps/backend
   railway link
   ```

4. Deploy to Railway:
   ```bash
   railway up
   ```

5. Get your deployment URL:
   ```bash
   railway domain
   ```

### 2. CI/CD Deployment

For automated deployments via GitHub Actions:

1. Generate a Railway API token:
   ```bash
   railway login
   railway whoami --token
   ```

2. Add the token to your GitHub repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Create a new repository secret named `RAILWAY_TOKEN` with the value of your token

3. Push to the main branch to trigger the CI/CD pipeline:
   ```bash
   git add .
   git commit -m "Fix Railway deployment"
   git push origin main
   ```

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Verify that the `CORS_ORIGIN` in `apps/backend/.env.production` matches your frontend URL exactly
2. Check that the backend is properly configured to handle CORS requests
3. Ensure that your frontend is making requests to the correct backend URL

### Authentication Issues

If authentication doesn't work:

1. Verify that the JWT_SECRET is set correctly in `apps/backend/.env.production`
2. Check that the frontend is sending the correct authentication headers
3. Verify that the Supabase configuration is correct

### Database Connection Issues

If there are issues connecting to the database:

1. Verify that the Supabase URL and keys are correct in `apps/backend/.env.production`
2. Check that the Supabase service is running
3. Verify that the database schema is correctly set up

## Monitoring

After deployment, you can monitor your application on Railway:

1. Go to the Railway dashboard: https://railway.app/dashboard
2. Select your project and service
3. View logs, metrics, and deployment status