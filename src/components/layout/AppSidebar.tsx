"use client";

import React from "react"; // Import React
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import RhLogo from '@/assets/rh.svg';
// Removed Footer import

export function AppSidebar() {
  // Re-enable temporary border classes for debugging
  const socialContainerBorder = "border border-purple-500";
  const socialLinkBorder = "border border-orange-500";
  const resumeContainerBorder = "border border-cyan-500";
  const resumeButtonBorder = "border border-lime-500";
  const mainFlexColBorder = "border border-pink-500"; // Parent of socials
  const sidebarBodyBorder = "border border-gray-500"; // Parent of resume container

  return (
    // Re-added gray border
    // Removed gap-10
    // Removed flex flex-col
    <SidebarBody className={`justify-between ${sidebarBodyBorder}`}>
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
      {/* Re-added pink border */}
      <div className={`flex flex-1 flex-col ${mainFlexColBorder}`}>
        {/* Main Navigation */}
        <div className="mt-8 flex flex-col gap-2">
          {siteConfig.sidebarNav.map((item, idx) => (
            <SidebarLink key={idx} link={item} />
          ))}
        </div>

        {/* Removed Footer component from here */}

        {/* Socials Section - Simplified */}
        {/* Re-added purple border */}
        {/* Added flex items-center pb-4 to vertically center the icon row */}
        <div className={`mt-auto pt-4 pb-4 flex items-center ${socialContainerBorder}`}>
          {/* Changed back to flex-col, items-center, removed gap, added conditional margins */}
          <div className="flex flex-col items-center px-4 w-full"> {/* Removed gap-y-[50px] */}
            {siteConfig.socialLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                // Re-added orange border, added conditional margin-bottom
                className={`text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors ${socialLinkBorder} ${idx === 0 ? 'mb-[50px]' : ''} ${idx === 1 ? 'mb-[60px]' : ''}`}
                aria-label={item.label}
              >
                {/* Clone icon to apply consistent size, casting props to satisfy TS */}
                {/* This uses @tabler/icons-react as per the state we are reverting to */}
                {React.cloneElement(item.icon, { className: "h-5 w-5" } as any)}
              </Link>
            ))}
          </div>
        </div>
      {/* Removed extra closing div from here */}
      </div>
      {/* Resume Button */}
      {/* Re-added cyan border */}
      {/* Changed bottom padding to 75px */}
      <div className={`${resumeContainerBorder} pb-[75px]`}>
        {/* Re-added lime border */}
        <Button asChild className={`w-full justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-300 ${resumeButtonBorder}`}>
           <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">Read Resume</a>
        </Button>
      </div>
      {/* Removed outer div */}

      {/* Removed black bar */}
    </SidebarBody>
  );
}