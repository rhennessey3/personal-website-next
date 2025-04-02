"use client";

import React from "react"; // Import React
import Link from "next/link";
// Import cn and buttonVariants
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import RickHennesseyLogo from '@/assets/rickhennesseylogo.svg'; // Import new logo component
// Removed Footer import

export function AppSidebar() {
  // Removed temporary border class definitions

  return (
    // Removed gray border variable usage below
    // Removed gap-10
    // Removed flex flex-col
    <SidebarBody className={`justify-between`}> {/* Removed red border */}
      {/* Top Section (Profile, Nav, Socials, Resume) */}
      {/* Removed outer div */}
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-2 pb-4 px-4 border-b-[0.5px] border-neutral-800"> {/* Removed gap-2 */}
        {/* Logo Container wrapped in Link */}
        <Link href="/" aria-label="Homepage">
          <div className="w-28 bg-white dark:bg-transparent flex items-center justify-center p-2"> {/* Removed h-28 */}
            {/* Use new logo component, removed sizing classes */}
            <RickHennesseyLogo />
          </div>
        </Link>
       <div className="text-center w-[200px] leading-tight"> {/* Added leading-tight */}
         {/* Removed name display */}
         <div className="text-xs text-neutral-500 px-[5px]">{siteConfig.title}</div> {/* Added px-[5px] */}
        </div>
      </div>
      {/* Removed pink border variable usage */}
      <div className={`flex flex-1 flex-col`}> {/* Removed ${mainFlexColBorder} */}
        {/* Main Navigation */}
        <div className="mt-8 flex flex-col gap-2"> {/* Removed green border */}
          {siteConfig.sidebarNav.map((item, idx) => (
            <SidebarLink key={idx} link={item} />
          ))}
        </div>

        {/* Removed Footer component from here */}

        {/* Socials Section - Simplified */}
        {/* Removed purple border variable usage */}
        {/* Reverted absolute positioning back to mt-auto, adjusted bottom padding */}
        <div className={`mt-auto pt-4 pb-[120px] flex items-center`}> {/* Changed pb-[200px] to pb-[120px] */}
          {/* Changed back to flex-col, items-center, removed gap, added conditional margins */}
          <div className="flex flex-row items-center justify-center px-4 w-full gap-x-6"> {/* Changed to flex-row, added justify-center and gap-x */}
            {siteConfig.socialLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                // Removed orange border variable usage, updated conditional margin-bottom for new icon
                className={`text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors`} // Removed conditional margins
                aria-label={item.label}
              >
                {/* Render icon directly from config to respect its defined props (like className) */}
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      {/* Removed extra closing div from here */}
      </div>
      {/* Resume Button Section Removed */}
    </SidebarBody>
  );
}