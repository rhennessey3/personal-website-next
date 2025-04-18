import { client } from "@/sanity/client";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Force dynamic rendering for every request
export const dynamic = 'force-dynamic';

// Define the expected structure of the About Page content from Sanity
interface SanityAboutPage {
  _id: string;
  pageTitle?: string; // Optional title
  contentBody: any[]; // Portable Text content is required
}

// GROQ query to fetch the single 'aboutPage' document
const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  _id,
  pageTitle,
  contentBody
}`;

// Configure image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// Async Server Component to fetch and render the About page content
export default async function AboutPage() {
  console.log('[AboutPage] Rendering started.'); // Log start

  const portableTextComponents: Partial<PortableTextReactComponents> = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return null;
            return (
                <div className="relative w-full h-96 my-4">
                    <Image
                        src={urlFor(value).width(1200).height(800).fit('max').auto('format').url()}
                        alt={value.alt || 'Image from content'}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                    />
                </div>
            );
        }
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-5 space-y-2 my-4">{children}</ul>,
      number: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-5 space-y-2 my-4">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
      number: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    },
    block: {
      h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-4xl font-bold my-6">{children}</h1>,
      h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-3xl font-semibold my-5">{children}</h2>,
      h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-2xl font-semibold my-4">{children}</h3>,
      h4: ({ children }: { children?: React.ReactNode }) => <h4 className="text-xl font-semibold my-3">{children}</h4>,
      normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-4">{children}</p>,
      blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote className="border-l-4 pl-4 italic my-4 text-neutral-600 dark:text-neutral-400">{children}</blockquote>,
    },
  };

  let aboutData: SanityAboutPage | null = null;
  try {
    console.log('[AboutPage] Attempting to fetch data...'); // Log before fetch
    aboutData = await client.fetch<SanityAboutPage | null>(ABOUT_PAGE_QUERY, {});
    // Log fetched data (or lack thereof)
    console.log('[AboutPage] Data fetched:', aboutData ? `Found document ID: ${aboutData._id}` : 'No data returned from query.');
  } catch (error) {
    // Log any error during the fetch itself
    console.error('[AboutPage] Error fetching data from Sanity:', error);
  }

  // Handle case where data is not found OR fetch failed
  if (!aboutData) {
    console.log('[AboutPage] No data found or fetch failed, triggering notFound().'); // Log before notFound
    notFound(); // Triggers Next.js 404 page
  }

  console.log('[AboutPage] Data found, rendering content.'); // Log before render

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {aboutData.pageTitle && (
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 border-b pb-4">
          {aboutData.pageTitle}
        </h1>
      )}
      {aboutData.contentBody && aboutData.contentBody.length > 0 ? (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={aboutData.contentBody} components={portableTextComponents} />
        </div>
      ) : (
         <p className="text-neutral-500 italic">About content hasn't been added yet.</p>
      )}
    </div>
  );
}