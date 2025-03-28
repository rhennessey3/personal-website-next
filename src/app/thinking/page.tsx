'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { getCaseStudies, getBlogPosts } from "@/lib/api";
import { CaseStudy, BlogPost, PaginatedResponse } from "@/lib/types";

type PostType = 'all' | 'case-study' | 'blog-post';

interface CombinedPost {
  id: string;
  type: 'case-study' | 'blog-post';
  title: string;
  summary: string;
  tags: string[];
  date: string;
  slug: string;
}

export default function ThinkingPage() {
  const [activeFilter, setActiveFilter] = useState<PostType>('all');
  const [combinedPosts, setCombinedPosts] = useState<CombinedPost[]>([]);
  
  // Fetch case studies and blog posts
  const {
    data: caseStudiesData,
    loading: caseStudiesLoading,
    error: caseStudiesError
  } = useApi<PaginatedResponse<CaseStudy>>(
    () => getCaseStudies({ limit: 10, page: 1 })
  );
  
  const {
    data: blogPostsData,
    loading: blogPostsLoading,
    error: blogPostsError
  } = useApi<PaginatedResponse<BlogPost>>(
    () => getBlogPosts({ limit: 10, page: 1 })
  );

  // Combine and format case studies and blog posts
  useEffect(() => {
    const posts: CombinedPost[] = [];
    
    // Add case studies
    if (caseStudiesData?.data) {
      const formattedCaseStudies = caseStudiesData.data.map(study => ({
        id: study.id,
        type: 'case-study' as const,
        title: study.title,
        summary: study.summary,
        tags: study.tags || [],
        date: study.published_date || study.created_at,
        slug: study.slug
      }));
      posts.push(...formattedCaseStudies);
    }
    
    // Add blog posts
    if (blogPostsData?.data) {
      const formattedBlogPosts = blogPostsData.data.map(post => ({
        id: post.id,
        type: 'blog-post' as const,
        title: post.title,
        summary: post.summary,
        tags: post.tags || [],
        date: post.published_date || post.created_at,
        slug: post.slug
      }));
      posts.push(...formattedBlogPosts);
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setCombinedPosts(posts);
  }, [caseStudiesData, blogPostsData]);

  // Filter posts based on active filter
  const filteredPosts = activeFilter === 'all'
    ? combinedPosts
    : combinedPosts.filter(post => post.type === activeFilter);

  // Loading state
  const isLoading = caseStudiesLoading || blogPostsLoading;
  
  // Error state
  const hasError = caseStudiesError || blogPostsError;

  // Fallback data for development/testing
  const fallbackPosts = [
    {
      id: "1",
      type: "case-study" as const,
      title: "Enterprise SaaS Platform Redesign",
      summary: "A comprehensive redesign of a B2B SaaS platform that improved user satisfaction by 35% and reduced support tickets by 28%.",
      tags: ["UX Design", "Product Strategy", "B2B"],
      date: "2025-03-15",
      slug: "enterprise-saas-redesign"
    },
    {
      id: "2",
      type: "blog-post" as const,
      title: "The Role of Product Management in Digital Transformation",
      summary: "Exploring how product managers can drive successful digital transformation initiatives by bridging business strategy and technical implementation.",
      tags: ["Product Management", "Digital Transformation", "Leadership"],
      date: "2025-02-28",
      slug: "product-management-digital-transformation"
    },
    {
      id: "3",
      type: "case-study" as const,
      title: "Mobile App User Onboarding Optimization",
      summary: "How we increased activation rates by 42% through a data-driven redesign of the user onboarding experience for a consumer mobile application.",
      tags: ["Mobile", "User Onboarding", "Metrics"],
      date: "2025-01-20",
      slug: "mobile-app-onboarding"
    },
    {
      id: "4",
      type: "blog-post" as const,
      title: "Building Effective Product Roadmaps",
      summary: "A practical guide to creating product roadmaps that align stakeholders, guide development, and adapt to changing market conditions.",
      tags: ["Product Roadmap", "Strategy", "Planning"],
      date: "2024-12-12",
      slug: "effective-product-roadmaps"
    },
    {
      id: "5",
      type: "case-study" as const,
      title: "E-commerce Checkout Optimization",
      summary: "A case study on reducing cart abandonment by 23% through strategic UX improvements to the checkout flow.",
      tags: ["E-commerce", "Conversion Optimization", "UX Research"],
      date: "2024-11-05",
      slug: "ecommerce-checkout-optimization"
    },
    {
      id: "6",
      type: "blog-post" as const,
      title: "Balancing User Needs and Business Goals",
      summary: "Strategies for product managers to effectively balance user-centered design with business objectives to create successful products.",
      tags: ["Product Strategy", "User-Centered Design", "Business Value"],
      date: "2024-10-18",
      slug: "balancing-user-needs-business-goals"
    }
  ];

  // Use fallback data if there's an error or no data is available yet
  const postsToDisplay = (hasError || (combinedPosts.length === 0 && !isLoading))
    ? fallbackPosts.filter(post => activeFilter === 'all' || post.type === activeFilter)
    : filteredPosts;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  // Show error state if needed
  if (hasError && postsToDisplay.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Loading Content</h3>
        <p>{caseStudiesError?.message || blogPostsError?.message || "Failed to load content. Please try again later."}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsToDisplay.map((post) => (
            <Card key={post.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                  {post.type === "case-study" ? "Case Study" : "Blog Post"} • {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                  <Link href={`/thinking/${post.slug}`}>
                    Read {post.type === "case-study" ? "Case Study" : "Article"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}