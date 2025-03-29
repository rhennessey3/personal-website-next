import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Define the expected structure of a Blog Post from Sanity
// Adjust based on your actual schema in sanity-schema.md
interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary?: string; // Optional summary
  content: any[]; // Portable Text content is usually required
  featuredImage?: { asset: { _ref: string } };
  publishedDate?: string;
  _createdAt: string;
  tags?: { name: string }[]; // Assuming tags are references
  // Add other fields as needed
}

// GROQ query to fetch a single blog post by slug
const BLOG_POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  summary,
  content,
  featuredImage,
  publishedDate,
  _createdAt,
  "tags": tags[]->{name} // Fetch referenced tag names
}`;

// Configure image URL builder (can be shared, but included here for completeness)
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// Define props for the page component
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Async Server Component to fetch and render the blog post
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const blogPost = await client.fetch<SanityBlogPost | null>(BLOG_POST_QUERY, { slug });

  // Handle case where post is not found
  if (!blogPost) {
    notFound(); // Triggers Next.js 404 page
  }

  const displayDate = blogPost.publishedDate || blogPost._createdAt;

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <header className="border-b pb-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{blogPost.title}</h1>
        {/* Optional: Display summary if it exists */}
        {/* <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">{blogPost.summary}</p> */}
        <div className="flex flex-wrap gap-4 items-center text-sm text-neutral-500 dark:text-neutral-400">
          <span>Published: {new Date(displayDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span>Tags:</span>
              {blogPost.tags.map((tag) => (
                <span key={tag.name} className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">{tag.name}</span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {blogPost.featuredImage && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={urlFor(blogPost.featuredImage).width(1200).height(800).url()}
            alt={blogPost.title || 'Featured image'}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      )}

      {/* Main Content */}
      {blogPost.content && blogPost.content.length > 0 ? (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Render Portable Text content */}
          <PortableText value={blogPost.content} />
        </div>
      ) : (
         <p className="text-neutral-500">Content coming soon...</p>
      )}

    </article>
  );
}

// Generate static paths for SSG
export async function generateStaticParams() {
  // Fetch all published blog post slugs
  const slugs = await client.fetch<string[]>(
    `*[_type == "blogPost" && defined(slug.current) && published == true][].slug.current`
  );

  // Return the expected format: array of objects with slug param
  return slugs.map((slug) => ({
    slug, // Matches the [slug] dynamic segment
  }));
}

// Optional: Add revalidation logic if needed
// export const revalidate = 60;