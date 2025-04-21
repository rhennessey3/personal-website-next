import { client } from "@/sanity/client";
import { PortableText, PortableTextReactComponents, PortableTextComponentProps } from "@portabletext/react"; // Import necessary types
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Added Carousel imports
import { ContactForm } from '@/components/contact-form'; // Import the contact form (named import)

// Define a reusable Image Asset type
interface SanityImageAsset {
  _ref: string;
  url: string;
  mimeType: string;
}

interface SanityCaseStudy {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string; // Will be replaced by subtitle in display logic
  subtitle?: string; // New field for subtitle
  featuredImage?: { asset: SanityImageAsset }; // Use the new type
  publishedDate?: string;
  _createdAt: string;
  tags?: { name: string }[]; // Assuming tags are references
  sections?: { // Assuming sections are objects within an array
    _key: string;
    title: string;
    sectionType: string; // May not be needed if layout handles visual distinction
    content?: any[]; // Portable Text content (optional for some layouts)
    image?: { asset: SanityImageAsset }; // Use the new type
    layout?: 'textLeft' | 'imageLeft' | 'twoColumnText' | 'threeColumnSlider' | 'twoColumnTextRowsImageRight'; // Added new layout
    // Fields for 'twoColumnText'
    contentRight?: any[];
    // Fields for 'threeColumnSlider'
    sliderItems?: {
      _key: string;
      image?: { asset: SanityImageAsset }; // Use the new type
      subhead?: string;
      bodyText?: any[];
    }[];
    // Fields for 'twoColumnTextRowsImageRight'
    mainHeading?: string;
    leftColumnItems?: {
      _key: string;
      subhead?: string;
      bodyText?: any[];
    }[];
    rightColumnImage?: { asset: SanityImageAsset }; // Use the new type
    backgroundColor?: 'rh-black' | 'rh-grey' | 'rh-white'; // Added background color field
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
  featuredImage{asset->{_ref, url, mimeType}}, // Fetch URL and mimeType
  publishedDate,
  _createdAt,
  "tags": tags[]->{name}, // Fetch referenced tag names
  sections[]{
    _key,
    title, // Keep title for potential fallback or other uses
    sectionType,
    content,
    image{asset->{_ref, url, mimeType}}, // Fetch URL and mimeType
    layout,
    // twoColumnText fields
    contentRight,
    // threeColumnSlider fields
    sliderItems[]{
      _key,
      image{asset->{_ref, url, mimeType}}, // Fetch URL and mimeType
      subhead,
      bodyText
    },
    // twoColumnTextRowsImageRight fields
    mainHeading,
    leftColumnItems[]{
      _key,
      subhead,
      bodyText
    },
    rightColumnImage{asset->{_ref, url, mimeType}}, // Fetch URL and mimeType
    backgroundColor // Fetch background color
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

  // Define components with correct types
  // Define components with correct types
  const portableTextComponents: Partial<PortableTextReactComponents> = {
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-5 space-y-2">{children}</ul>,
      number: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-5 space-y-2">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
      number: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    },
    // Add handlers for block styles
    block: {
      h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-4xl font-bold my-4">{children}</h1>,
      h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-3xl font-semibold my-3">{children}</h2>,
      h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-2xl font-semibold my-2">{children}</h3>,
      h4: ({ children }: { children?: React.ReactNode }) => <h4 className="text-xl font-semibold my-1">{children}</h4>,
      normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-2">{children}</p>,
      blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote className="border-l-4 pl-4 italic my-4">{children}</blockquote>,
    },
    // marks: { ... } // Optional marks configuration
  };

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
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]"> {/* Reverted to w-full */}
          {/* Background Image */}
          <Image
            src={urlFor(caseStudy.featuredImage).width(1600).height(900).url()} // Reverted dimensions
            alt={caseStudy.title || 'Featured image'}
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="z-0" // Ensure image is behind the overlay
          />
          {/* Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>

          {/* Text Content Overlay */}
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 text-white max-w-3xl">
             {/* Category Removed */}
             {/* Title */}
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">{caseStudy.title}</h1>
             {/* Subtitle (Requires Sanity Field: 'subtitle') */}
             <p className="text-lg md:text-xl text-neutral-200">{caseStudy.subtitle || 'Placeholder subtitle describing the project.'}</p>
             {/* Removed Summary */}
             {/* Date and Tags could be moved elsewhere */}
          </div>
        </div>
      )}

      {/* Constrained Content Area */}
      <article className="space-y-8"> {/* Removed px-8 */} {/* Removed max-w-4xl mx-auto, Removed padding comment */}

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
          <div className="-mt-8"> {/* Add negative top margin to counteract article's space-y-8 */}
            {caseStudy.sections.map((section, index) => {
              // Define color mapping
              const bgColorMap = {
                'rh-black': 'bg-rh-black text-rh-white',
                'rh-grey': 'bg-rh-grey text-rh-black',
                'rh-white': 'bg-rh-white text-rh-black',
              };
              const colorValue = section.backgroundColor as keyof typeof bgColorMap | undefined;
              const colorClasses = colorValue ? bgColorMap[colorValue] : '';
              // Add padding only if a background color is applied
              const wrapperPadding = colorValue ? 'py-8 px-8' : '';
              // Apply background color and rounding to the outer section tag if color exists
              const sectionWrapperClasses = colorValue ? `rounded-lg ${colorClasses}` : '';

              // Determine the content to render based on layout
              let sectionContent;
              if (section.image) {
                // Two-column layout (Image + Text)
                sectionContent = (
                  <div // Image + Text Container
                    className={`flex flex-col md:flex-row gap-8 lg:gap-12 items-start ${wrapperPadding} ${ // Apply padding here, changed items-center to items-start
                      (section.layout === 'imageLeft' || (!section.layout && index % 2 !== 0)) ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Text Content Column */}
                    <div className={`w-full md:w-1/2 flex-shrink-0`}>
                       <h2 className="text-3xl font-semibold mb-4">{section.title}</h2>
                       <div className="prose prose-lg dark:prose-invert max-w-none">
                         <PortableText value={section.content} components={portableTextComponents} />
                       </div>
                    </div>
                    {/* Image Column */}
                    <div className={`w-full md:w-1/2 mt-4 md:mt-0 flex-shrink-0 flex ${ // Removed justify-center
                      (section.layout === 'imageLeft' || (!section.layout && index % 2 !== 0)) ? 'pl-[45px]' : '' // Keep conditional padding for image alignment
                    }`}>
                      {(() => {
                        if (section.image.asset.mimeType === 'image/svg+xml') {
                          return (
                            <img
                              src={section.image.asset.url}
                              alt={section.title || 'Section image'}
                              width={800} // Keep width/height for layout
                              height={600}
                              style={{ objectFit: 'contain' }} // Style directly for SVG
                              className="rounded-lg shadow-md max-w-full h-auto" // Ensure responsiveness
                            />
                          );
                        } else {
                          return (
                            <Image
                              src={urlFor(section.image).auto('format').dpr(2).url()}
                              alt={section.title || 'Section image'}
                              width={800}
                              height={600}
                              style={{ objectFit: 'contain' }} // Ensure image fits within bounds
                              className="rounded-lg shadow-md"
                              quality={100}
                            />
                          );
                        }
                      })()}
                    </div>
                  </div>
                );
              } else if (section.layout === 'twoColumnText') {
                // --- Two Column Text Layout ---
                sectionContent = (
                  <div className={wrapperPadding}> {/* Apply padding here */}
                    <h2 className="text-3xl font-semibold mb-4">{section.title}</h2>
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                      {/* Left Text Column */}
                      <div className="w-full md:w-1/2 flex-shrink-0">
                         <div className="prose prose-lg dark:prose-invert max-w-none">
                           <PortableText value={section.content} components={portableTextComponents} />
                         </div>
                      </div>
                      {/* Right Text Column */}
                      <div className="w-full md:w-1/2 flex-shrink-0">
                         {section.contentRight && (
                           <div className="prose prose-lg dark:prose-invert max-w-none pr-[75px]"> {/* Keep right padding */}
                             <PortableText value={section.contentRight} components={portableTextComponents} />
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                );
              } else if (section.layout === 'threeColumnSlider') {
                // --- Three Column Slider Layout ---
                sectionContent = (
                  <div className={wrapperPadding}> {/* Apply padding here */}
                    <h2 className="text-3xl font-semibold mb-6 text-center">{section.title}</h2>
                    <Carousel
                      opts={{ align: "start", loop: true }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4">
                        {section.sliderItems && section.sliderItems.map((item) => (
                          <CarouselItem key={item._key} className="xl:basis-1/3 pl-4">
                            <div className="p-1 h-full">
                              <div className="flex flex-col h-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                                {item.image && (() => {
                                  if (item.image.asset.mimeType === 'image/svg+xml') {
                                    return (
                                      <img
                                        src={item.image.asset.url}
                                        alt={item.subhead || 'Slider image'}
                                        style={{ objectFit: 'contain' }}
                                        className="absolute inset-0 w-full h-full rounded-t-lg" // Fill container for SVG
                                      />
                                    );
                                  } else {
                                    return (
                                      <Image
                                        src={urlFor(item.image).auto('format').dpr(2).url()}
                                        alt={item.subhead || 'Slider image'}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        className="rounded-t-lg"
                                        quality={100}
                                      />
                                    );
                                  }
                                })()}
                                <div className="p-4 flex flex-col flex-grow">
                                  {item.subhead && <h3 className="text-lg font-semibold mb-2">{item.subhead}</h3>}
                                  {item.bodyText && (
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-sm flex-grow">
                                      <PortableText value={item.bodyText} components={portableTextComponents} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute left-[-10px] top-1/2 -translate-y-1/2 hidden md:inline-flex z-10" /> {/* Moved outward by 10px */}
                      <CarouselNext className="absolute right-[-10px] top-1/2 -translate-y-1/2 hidden md:inline-flex z-10" /> {/* Moved outward by 10px */}
                    </Carousel>
                  </div>
                );
              } else if (section.layout === 'twoColumnTextRowsImageRight') {
                // --- Two Column: Text Rows (Left) + Image (Right) ---
                sectionContent = (
                  <div className={wrapperPadding}> {/* Apply padding here */}
                    {section.mainHeading && (
                      <h2 className="text-3xl font-semibold mb-6 text-center">{section.mainHeading}</h2>
                    )}
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                      {/* Left Column (Text Rows) */}
                      <div className="w-full md:w-1/2 flex-shrink-0 space-y-6">
                        {section.leftColumnItems && section.leftColumnItems.map((item) => (
                          <div key={item._key}>
                            {item.subhead && <h3 className="text-xl font-semibold mb-2">{item.subhead}</h3>}
                            {item.bodyText && (
                              <div className="prose prose-base dark:prose-invert max-w-none">
                                <PortableText value={item.bodyText} components={portableTextComponents} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Right Column (Image) */}
                      <div className="w-full md:w-1/2 flex-shrink-0 flex justify-center items-center mt-6 md:mt-0">
                        {section.rightColumnImage && (() => {
                          if (section.rightColumnImage.asset.mimeType === 'image/svg+xml') {
                            return (
                              <img
                                src={section.rightColumnImage.asset.url}
                                alt={section.mainHeading || 'Section image'}
                                width={600} // Keep width/height for layout
                                height={450}
                                style={{ objectFit: 'contain' }} // Style directly for SVG
                                className="w-full rounded-lg shadow-md max-h-[450px] h-auto" // Ensure responsiveness
                              />
                            );
                          } else {
                            return (
                              <Image
                                src={urlFor(section.rightColumnImage).auto('format').dpr(2).url()}
                                alt={section.mainHeading || 'Section image'}
                                width={600}
                                height={450}
                                style={{ objectFit: 'contain' }}
                                className="w-full rounded-lg shadow-md max-h-[450px]"
                                quality={100}
                              />
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                );
              } else {
                 // --- Default Single Column Text Layout ---
                 sectionContent = (
                   <div className={`w-full ${wrapperPadding}`}> {/* Apply padding here */}
                     <h2 className="text-3xl font-semibold mb-4">{section.title}</h2>
                     <div className="prose prose-lg dark:prose-invert max-w-none">
                       <PortableText value={section.content} components={portableTextComponents} />
                     </div>
                  </div>
                 );
              }

              return (
                // Apply background/rounding to the outer section tag
                <section key={section._key} className={sectionWrapperClasses}>
                  {sectionContent}
                </section>
              );
            })}
          </div>
        )}

        {/* Fallback if no sections */}
        {(!caseStudy.sections || caseStudy.sections.length === 0) && (
           <p className="text-neutral-500">Content coming soon...</p>
        )}

      </article>

      {/* Add Contact Form Section */}
      <section className="py-12 md:py-16 px-8"> {/* Add padding consistent with article */}
        <h2 className="text-3xl font-semibold text-center mb-8">Get In Touch</h2>
        <div className="max-w-2xl mx-auto"> {/* Center the form */}
          <ContactForm />
        </div>
      </section>

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
export const revalidate = 60; // Revalidate every 60 seconds