import React from 'react';
// Import cn, buttonVariants, and siteConfig
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    // Removed px-8, kept py-6
    <footer className="fixed bottom-0 left-0 w-full bg-neutral-950 text-neutral-400 py-6 text-sm z-10"> {/* Removed red border */}
      {/* Kept flex layout, removed container/mx-auto/gap */}
      <div className="flex flex-row justify-between items-center px-8"> {/* Changed flex-col to flex-row, added justify-between, added px-8 */}
        {/* Left Div: Read Resume Button - Width matches sidebar, button centered inside */}
        <div className="flex justify-start"> {/* Removed fixed width and justify-center */}
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }), // Apply base button styles
              // Apply inverted color styles (white bg, black text)
              "w-auto justify-center rounded-full bg-neutral-100 text-black hover:bg-neutral-300", // Inverted colors
              // Remove original default styles that conflict
              "!bg-neutral-100 !text-black" // Use !important temporarily if needed, or refine base variant application
            )}
          >
            Read Resume
          </a>
        </div>

        {/* Right Div: Signature SVG - Pushed to the right, added padding right */}
        <div className="flex justify-end"> {/* Removed ml-auto and pr-8 (padding handled by parent) */}
          <img src="/Signature.svg" alt="Signature" className="h-8" /> {/* Added height class, adjust as needed */}
        </div>
      </div>
    </footer>
  );
}