import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Define the expected structure of a Case Study from Sanity
// Adjust based on your actual schema in sanity-schema.md
interface SanityCaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  featuredImage?: { asset: { _ref: string } }; // Assuming image field structure
  publishedDate?: string;
  _createdAt: string;
  tags?: { name: string }[]; // Assuming tags are references
  sections?: { // Assuming sections are objects within an array
    _key: string;
    title: string;
    sectionType: string;
    content: any[]; // Portable Text content
  }[];
  metrics?: { // Assuming metrics are objects within an array
    _key: string;
    label: string;
    value: string;
  }[];
  // Add other fields as needed
}

// GROQ query to fetch a single case study by slug
const CASE_STUDY_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  summary,
  featuredImage,
  publishedDate,
  _createdAt,
  "tags": tags[]->{name}, // Fetch referenced tag names
  sections[]{_key, title, sectionType, content},
  metrics[]{_key, label, value}
}`;

// Configure image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// Define props for the page component
interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

// Async Server Component to fetch and render the case study
export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = params;
  const caseStudy = await client.fetch<SanityCaseStudy | null>(CASE_STUDY_QUERY, { slug });

  // Handle case where study is not found
  if (!caseStudy) {
    notFound(); // Triggers Next.js 404 page
  }

  const displayDate = caseStudy.publishedDate || caseStudy._createdAt;

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <header className="border-b pb-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{caseStudy.title}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">{caseStudy.summary}</p>
        <div className="flex flex-wrap gap-4 items-center text-sm text-neutral-500 dark:text-neutral-400">
          <span>Published: {new Date(displayDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {caseStudy.tags && caseStudy.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span>Tags:</span>
              {caseStudy.tags.map((tag) => (
                <span key={tag.name} className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">{tag.name}</span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {caseStudy.featuredImage && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={urlFor(caseStudy.featuredImage).width(1200).height(800).url()}
            alt={caseStudy.title || 'Featured image'}
            layout="fill"
            objectFit="cover"
            priority // Load image sooner
          />
        </div>
      )}

      {/* Metrics */}
      {caseStudy.metrics && caseStudy.metrics.length > 0 && (
        <section className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {caseStudy.metrics.map((metric) => (
            <div key={metric._key}>
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{metric.label}</p>
            </div>
          ))}
        </section>
      )}

      {/* Sections */}
      {caseStudy.sections && caseStudy.sections.length > 0 && (
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          {caseStudy.sections.map((section) => (
            <section key={section._key}>
              <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
              {/* Render Portable Text content */}
              <PortableText value={section.content} />
            </section>
          ))}
        </div>
      )}

      {/* Fallback if no sections */}
      {(!caseStudy.sections || caseStudy.sections.length === 0) && (
         <p className="text-neutral-500">Content coming soon...</p>
      )}

    </article>
  );
}

// Optional: Generate static paths if using SSG (Static Site Generation)
// export async function generateStaticParams() {
//   const slugs = await client.fetch<string[]>(`*[_type == "caseStudy" && defined(slug.current)][].slug.current`);
//   return slugs.map((slug) => ({ slug }));
// }

// Optional: Add revalidation logic if needed
// export const revalidate = 60; // Revalidate every 60 seconds