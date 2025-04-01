"use client";

import React from "react"; // Import React
import Link from "next/link";
// Import cn and buttonVariants
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import RhLogo from '@/assets/rh.svg';
// Removed Footer import

export function AppSidebar() {
  // Removed temporary border class definitions

  return (
    // Removed gray border variable usage below
    // Removed gap-10
    // Removed flex flex-col
    <SidebarBody className={`justify-between`}> {/* Removed ${sidebarBodyBorder} */}
      {/* Top Section (Profile, Nav, Socials, Resume) */}
      {/* Removed outer div */}
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-2 p-4 border-b border-neutral-700">
        {/* Logo Container */}
        <div className="w-28 h-28 bg-white dark:bg-transparent mb-2 flex items-center justify-center overflow-hidden p-2">
          <RhLogo className="w-[95%] h-[95%] object-contain" />
        </div>
        <div className="text-center w-[200px]">
          <div className="font-semibold text-neutral-400">{siteConfig.name}</div>
          <div className="text-xs text-neutral-400">{siteConfig.title}</div>
        </div>
      </div>
      {/* Removed pink border variable usage */}
      <div className={`flex flex-1 flex-col`}> {/* Removed ${mainFlexColBorder} */}
        {/* Main Navigation */}
        <div className="mt-8 flex flex-col gap-2">
          {siteConfig.sidebarNav.map((item, idx) => (
            <SidebarLink key={idx} link={item} />
          ))}
        </div>

        {/* Removed Footer component from here */}

        {/* Socials Section - Simplified */}
        {/* Removed purple border variable usage */}
        {/* Added flex items-center pb-4 to vertically center the icon row */}
        <div className={`mt-auto pt-4 pb-4 flex items-center`}> {/* Removed ${socialContainerBorder} */}
          {/* Changed back to flex-col, items-center, removed gap, added conditional margins */}
          <div className="flex flex-col items-center px-4 w-full"> {/* Removed gap-y-[50px] */}
            {siteConfig.socialLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                // Removed orange border variable usage, added conditional margin-bottom
                className={`text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors ${idx === 0 ? 'mb-[50px]' : ''} ${idx === 1 ? 'mb-[60px]' : ''}`}
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
      {/* Resume Button */}
      {/* Removed cyan border variable usage */}
      {/* Changed bottom padding from 75px to 105px */}
      <div className={`pb-[105px]`}> {/* Removed ${resumeContainerBorder} */}
        {/* Removed Button wrapper, applied styles directly to <a> */}
        <a
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default", size: "default" }), // Apply base button styles
            // Apply specific overrides that were on the Button
            "w-full justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-300"
          )}
        >
          Read Resume
        </a>
      </div>
      {/* Removed outer div */}

      {/* Removed black bar */}
    </SidebarBody>
  );
}