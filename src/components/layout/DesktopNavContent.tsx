"use client";

import React from "react";
import Link from "next/link";
import { SidebarLink } from "@/components/ui/sidebar"; // Assuming SidebarLink is still exported or moved
import { siteConfig } from "@/config/site";
import RickHennesseyLogo from '@/assets/rickhennesseylogo.svg';

export function DesktopNavContent() {
  return (
    <>
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-2 pb-4 px-4 border-b-[0.5px] border-neutral-800">
        <Link href="/" aria-label="Homepage">
          <div className="w-28 bg-white dark:bg-transparent flex items-center justify-center p-2">
            <RickHennesseyLogo />
          </div>
        </Link>
        <div className="text-center w-[200px] leading-tight">
          <div className="text-xs text-neutral-500 px-[5px]">{siteConfig.title}</div>
        </div>
      </div>

      {/* Main Navigation Section (Grows) */}
      <div className="mt-8 flex flex-1 flex-col gap-2">
        {siteConfig.sidebarNav.map((item, idx) => (
          // Assuming SidebarLink handles its own base styling (padding, etc.)
          <SidebarLink key={idx} link={item} />
        ))}
        {/* No "Read Resume" link on desktop */}
      </div>

      {/* Socials Section (Pushed to bottom by flex-1 above) */}
      <div className="pt-4 pb-4 flex items-center">
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
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}