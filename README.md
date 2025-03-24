# Personal Website

A modern personal website built with Next.js, Express.js, and Supabase, featuring a blog, case studies, and an admin dashboard.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Aceternity UI

### Backend
- Express.js
- TypeScript
- Zod validation
- JWT authentication

### Database & Storage
- Supabase

### Development Tools
- Turborepo
- ESLint
- Prettier
- Husky

## Project Structure

```
personal-website/
├── apps/
│   ├── frontend/     # Next.js frontend application
│   └── backend/      # Express.js backend API
├── packages/
│   ├── config/       # Shared configurations (ESLint, TypeScript)
│   └── shared/       # Shared types, schemas, and utilities
└── package.json      # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-website
```

2. Run the setup script:
```bash
./setup.sh
```

3. Configure environment variables:
```bash
# Copy backend environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit the .env file with your values
```

4. Start development servers:
```bash
npm run dev
```

### Development

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Features

### Public Pages
- Home page with professional introduction
- Case studies showcase
- Blog posts
- About page with resume/CV
- Contact form

### Admin Dashboard
- Protected admin routes
- Content management for case studies and blog posts
- Profile/resume editor
- Contact form submissions management

## Database Schema

### Tables
- profiles
- work_experiences
- education
- skills
- case_studies
- case_study_sections
- case_study_metrics
- blog_posts
- tags
- case_study_tags
- blog_post_tags
- contact_submissions

## API Routes

### Public Endpoints
```
GET    /api/case-studies           - Get all case studies
GET    /api/case-studies/:slug     - Get specific case study
GET    /api/blog-posts             - Get all blog posts
GET    /api/blog-posts/:slug       - Get specific blog post
GET    /api/profile                - Get profile information
POST   /api/contact                - Submit contact form
```

### Protected Admin Endpoints
```
POST   /api/auth/login             - Admin login
POST   /api/auth/logout            - Admin logout
GET    /api/admin/*                - Various admin endpoints
```

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.