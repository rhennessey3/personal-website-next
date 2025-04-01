"use client";

// Imports for components used directly on the page (if any)
import { useProfileImage } from '@/sanity/hooks/useProfileImage'; // Keep the hook import

// Import the new section components
import { HeroSection } from '@/components/sections/home/HeroSection';
// import { MetricsSection } from '@/components/sections/home/MetricsSection'; // Removed import
import { ExpertiseSection } from '@/components/sections/home/ExpertiseSection';

// Removed Aceternity UI imports that are now within section components

export default function Home() {
  // Use the custom hook to get profile image data and functions
  const { profileImage, loadingImage, urlFor } = useProfileImage();

  // Define border classes as empty strings to remove them
  const debugBorder = ""; // "border border-red-500";
  const heroDebugBorder = ""; // "border border-blue-500";
  const expertiseDebugBorder = ""; // "border border-green-500";

  return (
    // Added flex-grow to make this container fill the vertical space of the main element
    // Removed justify-center
    // Removed temporary red border
    <div className={`flex flex-col flex-grow ${debugBorder}`}>
      {/* Removed temporary blue border wrapper */}
      <div className={heroDebugBorder}>
        <HeroSection
          profileImage={profileImage}
          loadingImage={loadingImage}
          urlFor={urlFor}
        />
      </div>

      {/* Render Metrics Section - Removed */}
      {/* <MetricsSection /> */}

      {/* Removed temporary green border wrapper */}
      {/* Added mt-auto to push this section to the bottom */}
      <div className={`${expertiseDebugBorder} mt-auto`}>
        <ExpertiseSection />
      </div>

      {/* Comments about removed JSX remain for clarity */}
    </div>
  );
}
