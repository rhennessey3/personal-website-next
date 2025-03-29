# Personal Website

A modern personal website built with Next.js and Sanity CMS, featuring a blog, case studies, and an admin dashboard.

## Tech Stack

### Frontend & CMS
- Next.js
- TypeScript
- Sanity (Headless CMS)
- Tailwind CSS
- shadcn/ui
- Aceternity UI

### Development Tools
- ESLint
- Prettier
- Jest (for testing)

## Project Structure

```
personal-website-next/
├── public/             # Static assets (images, fonts, etc.)
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   │   ├── (public)/   # Public routes (home, about, blog, case-studies) - Note: Actual structure might vary
│   │   ├── admin/      # Admin dashboard routes
│   │   ├── api/        # API routes (if any)
│   │   ├── globals.css # Global styles
│   │   └── layout.tsx  # Root layout
│   ├── components/     # React components
│   │   ├── ui/         # UI primitives (shadcn, aceternity)
│   │   └── ...         # Other custom components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions, types
│   ├── sanity/         # Sanity client configuration
│   └── middleware.ts   # Next.js middleware (e.g., for auth)
├── sanity-schema.md    # Documentation for Sanity schema structure
├── next.config.mjs     # Next.js configuration
├── postcss.config.mjs  # PostCSS configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+ or yarn or pnpm
- Sanity account and project configured (see `src/sanity/client.ts` and environment variables)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd personal-website-next
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    ```

3.  Configure environment variables:
    Create a `.env.local` file in the root directory and add your Sanity project details:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_SANITY_DATASET="your_dataset"
    NEXT_PUBLIC_SANITY_API_VERSION="2023-05-03" # Or your preferred API version
    # Add any other required environment variables (e.g., for admin auth)
    ```
    *Note: You might need a Sanity API token for authenticated client access, especially for the admin section.*

4.  Start the development server:
    ```bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    ```

### Development

- Frontend: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: Access your Sanity project studio online to manage content.

## Features

### Public Pages
- Home page with professional introduction
- Case studies showcase (fetched from Sanity)
- Blog posts (fetched from Sanity)
- About page with resume/CV (potentially fetched from Sanity)
- Contact form

### Admin Dashboard
- Protected admin routes (authentication mechanism TBD/implemented)
- Content management interfaces (potentially linking to Sanity Studio or custom-built)

## Content Management

Content (blog posts, case studies, profile information) is managed using Sanity CMS. Refer to `sanity-schema.md` for the structure of the content types.

## Contributing

1.  Create a new branch
2.  Make your changes
3.  Submit a pull request

## License

This project is licensed under the MIT License. (Assuming MIT, update if different)