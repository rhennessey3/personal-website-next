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
  summary: string; // Will be replaced by subtitle in display logic
  subtitle?: string; // New field for subtitle
  featuredImage?: { asset: { _ref: string } }; // Assuming image field structure
  publishedDate?: string;
  _createdAt: string;
  tags?: { name: string }[]; // Assuming tags are references
  sections?: { // Assuming sections are objects within an array
    _key: string;
    title: string;
    sectionType: string; // May not be needed if layout handles visual distinction
    content: any[]; // Portable Text content
    image?: { asset: { _ref: string } }; // Optional section image
    layout?: 'textLeft' | 'imageLeft'; // Optional layout preference
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
  summary, // Keep fetching for now, but won't be displayed in header
  subtitle, // Fetch new field
  featuredImage,
  publishedDate,
  _createdAt,
  "tags": tags[]->{name}, // Fetch referenced tag names
  sections[]{
    _key,
    title,
    sectionType,
    content,
    image, // Fetch section image
    layout // Fetch layout preference
  },
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
    return null; // Ensure component stops execution here for TS
  }

  const displayDate = caseStudy.publishedDate || caseStudy._createdAt;

  return (
    <div className="-m-8 md:-m-16"> {/* Negative margins to counteract layout padding */}
    <> {/* Use Fragment inside */}
      {/* Full Width Header Section */}
      {caseStudy.featuredImage && (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] border border-red-500"> {/* Reverted to w-full */}
          {/* Background Image */}
          <Image
            src={urlFor(caseStudy.featuredImage).width(1600).height(900).url()} // Reverted dimensions
            alt={caseStudy.title || 'Featured image'}
            layout="fill"
            objectFit="cover"
            priority
            className="z-0 border border-orange-500" // Ensure image is behind the overlay
          />
          {/* Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10 border border-yellow-500"></div>

          {/* Text Content Overlay */}
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 text-white max-w-3xl border border-lime-500">
             {/* Category Removed */}
             {/* Title */}
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 border border-green-500">{caseStudy.title}</h1>
             {/* Subtitle (Requires Sanity Field: 'subtitle') */}
             <p className="text-lg md:text-xl text-neutral-200 border border-teal-500">{caseStudy.subtitle || 'Placeholder subtitle describing the project.'}</p>
             {/* Removed Summary */}
             {/* Date and Tags could be moved elsewhere */}
          </div>
        </div>
      )}

      {/* Constrained Content Area */}
      <article className="space-y-8 border border-cyan-500"> {/* Removed max-w-4xl mx-auto, Removed padding comment */}

        {/* Metrics */}
        {caseStudy.metrics && caseStudy.metrics.length > 0 && (
          <section className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-center border border-blue-500">
            {caseStudy.metrics.map((metric) => (
              <div key={metric._key} className="border border-indigo-500">
                <p className="text-2xl font-bold text-primary border border-violet-500">{metric.value}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 border border-purple-500">{metric.label}</p>
              </div>
            ))}
          </section>
        )}

        {/* Sections */}
        {caseStudy.sections && caseStudy.sections.length > 0 && (
          <div className="space-y-12 md:space-y-16 border border-fuchsia-500"> {/* Increased spacing between sections */}
            {caseStudy.sections.map((section, index) => (
              <section key={section._key} className="space-y-4 border border-pink-500">
                {/* Section Title - Optional: Hide if you want title within the text column */}
                {/* <h2 className="text-3xl font-semibold border-b pb-2 mb-4">{section.title}</h2> */}
  
                {section.image ? (
                  // Two-column layout (Image + Text)
                  <div
                    className={`flex flex-col md:flex-row gap-8 lg:gap-12 items-start border border-rose-500 ${
                      // Use layout field if present, otherwise alternate based on index (even index = text left, odd index = image left)
                      (section.layout === 'imageLeft' || (!section.layout && index % 2 !== 0)) ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Text Content Column */}
                    <div className={`w-full md:w-1/2 flex-shrink-0 border border-red-600 ${
                      // Add padding based on text position: pl if text is left, pr if text is right
                      (section.layout === 'imageLeft' || (!section.layout && index % 2 !== 0))
                        ? 'md:pr-8' // Text is on the right (image left), add right padding
                        : 'md:pl-8' // Text is on the left (image right), add left padding
                    }`}>
                       {/* Render Title within text column */}
                       <h2 className="text-3xl font-semibold mb-4 border border-orange-600">{section.title}</h2>
                       <div className="prose prose-lg dark:prose-invert max-w-none border border-yellow-600">
                         <PortableText value={section.content} />
                       </div>
                    </div>
                    {/* Image Column */}
                    <div className="w-full md:w-1/2 mt-4 md:mt-0 flex-shrink-0 border border-lime-600 flex justify-center"> {/* Added flex justify-center */}
                      <Image
                        src={urlFor(section.image).width(800).height(600).auto('format').quality(80).url()}
                        alt={section.title || 'Section image'}
                        width={800}
                        height={600}
                        className="mx-auto rounded-lg object-cover shadow-md aspect-[4/3] border border-green-600" // Added mx-auto and moved existing classes here
                      />
                    </div>
                  </div>
                ) : (
                  // Text-only layout
                  <div className="border border-teal-600">
                     <h2 className="text-3xl font-semibold mb-4 border border-cyan-600">{section.title}</h2>
                     <div className="prose prose-lg dark:prose-invert max-w-none border border-blue-600">
                       <PortableText value={section.content} />
                     </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
  
        {/* Fallback if no sections */}
        {(!caseStudy.sections || caseStudy.sections.length === 0) && (
           <p className="text-neutral-500 border border-indigo-600">Content coming soon...</p>
        )}

      </article>
    </> {/* Close Fragment */}
    </div> // Close negative margin wrapper
  ); // Close the return statement parenthesis
}

// Optional: Generate static paths if using SSG (Static Site Generation)
// export async function generateStaticParams() {
//   const slugs = await client.fetch<string[]>(`*[_type == "caseStudy" && defined(slug.current)][].slug.current`);
//   return slugs.map((slug) => ({ slug }));
// }

// Optional: Add revalidation logic if needed
// export const revalidate = 60; // Revalidate every 60 seconds