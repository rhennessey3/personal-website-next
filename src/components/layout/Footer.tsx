import React from 'react';
import { siteConfig } from '@/config/site'; // Import site config for potential use (e.g., name)

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-neutral-950 text-neutral-400 py-6 px-8 text-sm z-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Copyright */}
        <div>
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </div>

        {/* Optional: Add other footer links or content here */}
        {/* Example:
        <nav className="flex gap-4">
          <a href="#" className="hover:text-neutral-100">Privacy Policy</a>
          <a href="#" className="hover:text-neutral-100">Terms of Service</a>
        </nav>
        */}
      </div>
    </footer>
  );
}