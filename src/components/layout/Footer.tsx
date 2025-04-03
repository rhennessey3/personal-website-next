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
      <div className="flex flex-row justify-between items-center pr-8"> {/* Changed px-8 to pr-8 to remove left padding */}
        {/* Left Div: Read Resume Button - Width matches sidebar, button centered inside */}
        <div className="flex justify-start"> {/* Removed fixed width and justify-center */}
          {/* Wrapper for Regular button (md and above) */}
          <div className="hidden md:block">
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                // Removed responsive classes from here
                buttonVariants({ variant: "default", size: "default" }),
                "w-auto justify-center rounded-full bg-neutral-100 text-black hover:bg-neutral-300",
                "!bg-neutral-100 !text-black",
                "scale-85 transform" /* Added scale-85 to make button 15% smaller */
              )}
            >
              Read Resume
            </a>
          </div>
          
          {/* Wrapper for Compact button (below md) */}
          <div className="block md:hidden">
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                // Removed responsive classes, added inline-flex for button layout
                "inline-flex",
                "h-6 px-2 py-0 text-xs", // Very small button
                "items-center justify-center whitespace-nowrap rounded-full",
                "font-medium transition-colors",
                "bg-neutral-100 text-black hover:bg-neutral-300"
              )}
            >
              Resume
            </a>
          </div>
        </div>

        {/* Right Div: Signature SVG - Pushed to the right, added padding right */}
        <div className="flex justify-end"> {/* Removed ml-auto and pr-8 (padding handled by parent) */}
          <img src="/Signature.svg" alt="Signature" className="h-8" /> {/* Added height class, adjust as needed */}
        </div>
      </div>
    </footer>
  );
}