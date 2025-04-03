"use client";

import React from "react";
import Link from "next/link";
import { SidebarLink } from "@/components/ui/sidebar"; // Assuming SidebarLink is still exported or moved
import { siteConfig } from "@/config/site";
import RickHennesseyLogo from '@/assets/rickhennesseylogo.svg';
// Removed individual icon imports, will use siteConfig

export function DesktopNavContent() {
  return (
    <div className="flex flex-col h-full"> {/* Removed debugging borders */}
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-2 pb-4 px-4 border-b-[0.5px] border-neutral-800">
        <Link href="/" aria-label="Homepage">
          <div className="w-28 bg-white dark:bg-transparent flex items-center justify-center p-2">
            <RickHennesseyLogo />
          </div>
        </Link>
        {/* Removed title line as requested */}
      </div>

      {/* Main Navigation Section */}
      <div className="mt-8 flex flex-col gap-2">
        {siteConfig.sidebarNav.map((item, idx) => (
          <SidebarLink key={idx} link={item} />
        ))}
      </div>
      
      {/* Spacer to push content down */}
      <div className="flex-grow"></div>
      
      {/* Social Links Container - Positioned to align with Product Strategy card */}
      <div className="py-4 mt-8"> {/* Removed yellow background and debugging borders */}
        <div className="flex flex-col items-center justify-center gap-y-3 pb-[100px]"> {/* Removed debugging borders */}
          {/* Social links */}
          {siteConfig.socialLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              target={item.href === "#" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity flex items-center justify-center"
              aria-label={item.label}
            >
              <img
                src={`/${item.label.toLowerCase()}.svg`}
                alt={item.label}
                className="h-6 w-6"
                width={24}
                height={24}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}