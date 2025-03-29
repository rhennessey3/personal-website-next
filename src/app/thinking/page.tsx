'use client';

import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import Link from "next/link";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { client } from "@/sanity/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ... (interfaces and queries remain the same) ...
interface SanityPost {
  _id: string;
  _type: 'caseStudy' | 'blogPost';
  title: string;
  summary?: string;
  tags?: { name: string }[] | string[];
  publishedDate?: string;
  _createdAt: string;
  slug: { current: string };
}
interface CombinedPost {
  id: string;
  type: 'case-study' | 'blog-post';
  title: string;
  summary: string;
  tags: string[];
  date: string;
  slug: string;
}
type PostType = 'all' | 'case-study' | 'blog-post';
const CASE_STUDIES_QUERY = `*[_type == "caseStudy" && defined(slug.current)]{ _id, _type, title, summary, slug, publishedDate, _createdAt, "tags": tags[]->name }`;
const BLOG_POSTS_QUERY = `*[_type == "blogPost" && defined(slug.current)]{ _id, _type, title, summary, slug, publishedDate, _createdAt, "tags": tags[]->name }`;

// Component to handle reading search params and rendering the page content
function ThinkingPageContent() {
  const searchParams = useSearchParams();
  const initialFilterParam = searchParams.get('filter');

  // Determine initial filter state based on URL parameter
  const getInitialFilter = (): PostType => {
    if (initialFilterParam === 'case-study' || initialFilterParam === 'blog-post') {
      return initialFilterParam;
    }
    return 'all';
  };

  const [activeFilter, setActiveFilter] = useState<PostType>(getInitialFilter);
  const [combinedPosts, setCombinedPosts] = useState<CombinedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data using Sanity client
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const [caseStudiesData, blogPostsData] = await Promise.all([
          client.fetch<SanityPost[]>(CASE_STUDIES_QUERY),
          client.fetch<SanityPost[]>(BLOG_POSTS_QUERY)
        ]);

        const posts: CombinedPost[] = [];

        // Add case studies
        if (caseStudiesData) {
          const formattedCaseStudies = caseStudiesData.map(study => ({
            id: study._id,
            type: 'case-study' as const,
            title: study.title || 'Untitled Case Study',
            summary: study.summary || '',
            tags: (study.tags?.map(tag => typeof tag === 'string' ? tag : tag?.name).filter(Boolean) as string[]) || [],
            date: study.publishedDate || study._createdAt,
            slug: study.slug.current
          }));
          posts.push(...formattedCaseStudies);
        }

        // Add blog posts
        if (blogPostsData) {
          const formattedBlogPosts = blogPostsData.map(post => ({
            id: post._id,
            type: 'blog-post' as const,
            title: post.title || 'Untitled Blog Post',
            summary: post.summary || '',
            tags: (post.tags?.map(tag => typeof tag === 'string' ? tag : tag?.name).filter(Boolean) as string[]) || [],
            date: post.publishedDate || post._createdAt,
            slug: post.slug.current
          }));
          posts.push(...formattedBlogPosts);
        }

        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setCombinedPosts(posts);

      } catch (err) {
        console.error("Failed to fetch Sanity data:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch once on mount

  // Filter posts based on active filter
  const filteredPosts = activeFilter === 'all'
    ? combinedPosts
    : combinedPosts.filter(post => post.type === activeFilter);

    // Loading state UI (can be reused or customized)
    const LoadingIndicator = () => (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading content...</p>
        </div>
      </div>
    );

  // Show loading state
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Loading Content</h3>
        <p>{error.message || "Failed to load content from Sanity. Please try again later."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Thinking & Work</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">
            A collection of case studies and articles reflecting my experience in product management and UX strategy.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeFilter === 'all' ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'case-study' ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveFilter('case-study')}
          >
            Case Studies
          </Button>
          <Button
            variant={activeFilter === 'blog-post' ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveFilter('blog-post')}
          >
            Blog Posts
          </Button>
        </div>
      </section>

      {/* Masonry-style layout for posts */}
      <section>
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    {post.type === "case-study" ? "Case Study" : "Blog Post"} • {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="outline" asChild>
                    <Link href={`/${post.type === 'case-study' ? 'case-studies' : 'blog'}/${post.slug}`}>
                      Read {post.type === "case-study" ? "Case Study" : "Article"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-12">
            No {activeFilter !== 'all' ? activeFilter.replace('-', ' ') + 's' : 'posts'} found.
          </p>
        )}
      </section>
    </div>
  );
}

// Wrap the main content component in Suspense for useSearchParams
export default function ThinkingPage() {
  return (
    <Suspense fallback={<div>Loading filter...</div>}> {/* Basic fallback */}
      <ThinkingPageContent />
    </Suspense>
  );
}