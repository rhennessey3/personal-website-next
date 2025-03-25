# Railway Deployment Notes

This document explains the special accommodations made to deploy the backend to Railway.

## Monorepo Structure and Railway Deployment

Our project uses a monorepo structure with shared code in the `packages/shared` directory. However, Railway's Docker build process had difficulty with this structure, resulting in build failures.

## Changes Made for Railway Deployment

### 1. Simplified Dockerfile

We created a simplified Dockerfile (`apps/backend/Dockerfile`) that:
- Uses a Node.js base image
- Copies only the backend code
- Uses a temporary package.json file without monorepo dependencies
- Builds and runs the backend as a standalone application

### 2. Local Schema Files

To avoid dependencies on the shared package, we created local copies of the schema files:
- Original location: `packages/shared/src/schemas/`
- New location: `apps/backend/src/schemas/`

The following schema files were duplicated:
- `case-study.ts`
- `blog-post.ts`
- `profile.ts`
- `contact.ts`

We also updated import statements in the route files to use these local schemas:
```typescript
// Before
import { caseStudySchema } from '@personal-website/shared';

// After
import { caseStudySchema } from '../schemas';
```

### 3. Environment Configuration

We updated environment files to ensure proper communication:
- `apps/backend/.env.production`: Contains Supabase credentials and CORS settings
- `apps/frontend/.env.production`: Contains the backend API URL
- `apps/frontend/vercel.json`: Contains environment variables and API route proxy settings

## Maintenance Considerations

When making changes to the schema files in the shared package, remember to also update the corresponding files in the backend project if you plan to redeploy to Railway.

## Deployment Process

To deploy the backend to Railway:
1. Ensure all changes are committed and pushed to GitHub
2. Set up the following environment variables in Railway:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase service key
   - `JWT_SECRET`: A secret key for JWT token generation
   - `CORS_ORIGIN`: Your frontend domain (e.g., https://personal-website-next-frontend.vercel.app)
3. Run `railway up --detach` from the backend directory

To deploy the frontend to Vercel:
1. Connect your GitHub repository to Vercel
2. Configure the environment variables in the Vercel dashboard
3. Deploy the frontend

## Security Considerations

For security reasons:
1. Never commit sensitive keys or credentials to the repository
2. The `.env.production` file has been added to `.gitignore`
3. Use environment variables in Railway and Vercel to store sensitive information
4. Rotate your Supabase keys if they have been accidentally exposed

## Alternative Approaches

In the future, we might consider:
1. Setting up a proper CI/CD pipeline that builds the entire monorepo
2. Using a different deployment strategy that better supports monorepos
3. Restructuring the project to make the backend completely independent