import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThinkingPage() {
  // Mock data for case studies and blog posts
  const posts = [
    {
      id: 1,
      type: "case-study",
      title: "Enterprise SaaS Platform Redesign",
      summary: "A comprehensive redesign of a B2B SaaS platform that improved user satisfaction by 35% and reduced support tickets by 28%.",
      tags: ["UX Design", "Product Strategy", "B2B"],
      date: "March 15, 2025",
      slug: "enterprise-saas-redesign"
    },
    {
      id: 2,
      type: "blog-post",
      title: "The Role of Product Management in Digital Transformation",
      summary: "Exploring how product managers can drive successful digital transformation initiatives by bridging business strategy and technical implementation.",
      tags: ["Product Management", "Digital Transformation", "Leadership"],
      date: "February 28, 2025",
      slug: "product-management-digital-transformation"
    },
    {
      id: 3,
      type: "case-study",
      title: "Mobile App User Onboarding Optimization",
      summary: "How we increased activation rates by 42% through a data-driven redesign of the user onboarding experience for a consumer mobile application.",
      tags: ["Mobile", "User Onboarding", "Metrics"],
      date: "January 20, 2025",
      slug: "mobile-app-onboarding"
    },
    {
      id: 4,
      type: "blog-post",
      title: "Building Effective Product Roadmaps",
      summary: "A practical guide to creating product roadmaps that align stakeholders, guide development, and adapt to changing market conditions.",
      tags: ["Product Roadmap", "Strategy", "Planning"],
      date: "December 12, 2024",
      slug: "effective-product-roadmaps"
    },
    {
      id: 5,
      type: "case-study",
      title: "E-commerce Checkout Optimization",
      summary: "A case study on reducing cart abandonment by 23% through strategic UX improvements to the checkout flow.",
      tags: ["E-commerce", "Conversion Optimization", "UX Research"],
      date: "November 5, 2024",
      slug: "ecommerce-checkout-optimization"
    },
    {
      id: 6,
      type: "blog-post",
      title: "Balancing User Needs and Business Goals",
      summary: "Strategies for product managers to effectively balance user-centered design with business objectives to create successful products.",
      tags: ["Product Strategy", "User-Centered Design", "Business Value"],
      date: "October 18, 2024",
      slug: "balancing-user-needs-business-goals"
    }
  ];

  // These filters can be used when implementing the filter functionality
  // const caseStudies = posts.filter(post => post.type === "case-study");
  // const blogPosts = posts.filter(post => post.type === "blog-post");

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
          <Button variant="outline" className="rounded-full">All</Button>
          <Button variant="outline" className="rounded-full">Case Studies</Button>
          <Button variant="outline" className="rounded-full">Blog Posts</Button>
        </div>
      </section>

      {/* Masonry-style layout for posts */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                  {post.type === "case-study" ? "Case Study" : "Blog Post"} • {post.date}
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
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