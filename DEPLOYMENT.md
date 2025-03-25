# Deployment Guide

This document provides instructions for deploying the personal website to production.

## Prerequisites

- A Vercel account for frontend deployment
- A Node.js hosting service account (Render, Railway, or similar) for backend deployment
- A Supabase account for database hosting
- A GitHub account for CI/CD integration

## Environment Variables

### Frontend (Vercel)

The following environment variables need to be set in your Vercel project:

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Backend (Node.js Hosting Service)

The following environment variables need to be set in your backend hosting service:

```
PORT=8080 (or as required by your hosting provider)
NODE_ENV=production
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

## Deployment Steps

### 1. Deploy the Backend

#### Using Render

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the service:
   - Name: `personal-website-backend`
   - Root Directory: `apps/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add the environment variables listed above
5. Deploy the service

#### Using Railway

1. Create a new project in Railway
2. Connect your GitHub repository
3. Configure the service:
   - Root Directory: `apps/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add the environment variables listed above
5. Deploy the service

### 2. Deploy the Frontend

#### Using Vercel

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `apps/frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add the environment variables listed above
5. Deploy the project

### 3. Set Up CI/CD with GitHub Actions

The repository already includes a GitHub Actions workflow file (`.github/workflows/ci-cd.yml`) that will:

1. Run tests
2. Build the project
3. Deploy to Vercel (frontend) and your chosen backend hosting service

To set up the CI/CD pipeline:

1. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - For backend deployment (e.g., Railway):
     - `RAILWAY_TOKEN`: Your Railway API token

2. Push to the `main` branch to trigger the CI/CD pipeline

## Post-Deployment Verification

After deploying, verify that:

1. The frontend is accessible at your Vercel URL
2. The backend API is accessible at your backend hosting URL
3. The frontend can communicate with the backend
4. Authentication works correctly
5. All features (case studies, blog posts, profile, contact) work as expected

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Verify that the `CORS_ORIGIN` environment variable in the backend is set correctly
2. Check that the backend is properly configured to handle CORS requests

### Authentication Issues

If authentication doesn't work:

1. Verify that the JWT_SECRET is set correctly
2. Check that the frontend is sending the correct authentication headers
3. Verify that the Supabase configuration is correct

### Database Connection Issues

If there are issues connecting to the database:

1. Verify that the Supabase URL and keys are correct
2. Check that the Supabase service is running
3. Verify that the database schema is correctly set up

## Monitoring and Maintenance

- Set up monitoring for both frontend and backend services
- Regularly backup the Supabase database
- Monitor error logs and performance metrics
- Set up alerts for critical issues