"use client";

import React from "react";
import Link from "next/link";
import { SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import RickHennesseyLogo from '@/assets/rickhennesseylogo.svg';

export function AppSidebar() {
  return (
    <SidebarBody>
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-2 pb-4 px-4 border-b-[0.5px] border-neutral-800 border border-blue-500"> {/* Added blue border */}
          <Link href="/" aria-label="Homepage">
            <div className="w-28 bg-white dark:bg-transparent flex items-center justify-center p-2">
              <RickHennesseyLogo />
            </div>
          </Link>
          <div className="text-center w-[200px] leading-tight">
            <div className="text-xs text-neutral-500 px-[5px]">{siteConfig.title}</div>
          </div>
        </div>

            {/* Main Navigation */}
        {/* Added flex-1 to allow this section to grow */}
        <div className="mt-8 flex flex-1 flex-col gap-2">
          {siteConfig.sidebarNav.map((item, idx) => (
            <SidebarLink key={idx} link={item} />
          ))}
          {/* Resume link visible only below md breakpoint */}
          <SidebarLink
            link={{ label: "Read Resume", href: siteConfig.resumeUrl, icon: <></> }}
            className="flex md:hidden" // Show as flex by default, hide at md breakpoint and above
          />
            </div>
  
          {/* Socials Section */}
        {/* mt-auto pushes this section to the bottom of the flex container */}
        {/* Removed mt-auto as preceding flex-1 element handles positioning */}
        {/* Removed mt-auto as preceding flex-1 element handles positioning */}
        <div className="mt-auto pt-4 pb-4 flex items-center border border-blue-500"> {/* Added blue border, Re-added mt-auto */}
          <div className="flex flex-row items-center justify-center px-4 w-full gap-x-6">
            {siteConfig.socialLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
                aria-label={item.label}
              >
                {/* Render icon directly from config */}
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
    </SidebarBody>
  );
}