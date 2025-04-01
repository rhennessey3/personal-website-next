import React from "react"; // Import React for JSX
import {
  IconHome,
  IconNotebook,
  IconUser,
  IconBrandLinkedin, // Keep LinkedIn
  IconBrandInstagram, // Add Instagram
  IconBrandSpotify, // Add Spotify
} from "@tabler/icons-react";
import { ReactElement } from "react"; // Import ReactElement for icon type

export interface NavItem {
  href: string;
  label: string;
  icon: ReactElement; // Use ReactElement for the icon type
}

export interface SocialLink {
  label: string;
  href: string;
  icon: ReactElement; // Use ReactElement for the icon type
}

export const siteConfig = {
  name: "Richard Hennessey III", // Optional: Add site name/owner
  title: "Product & UX", // Optional: Add site title/tagline
  logo: "/rh.svg", // Path to logo
  resumeUrl: "#", // Placeholder for resume link
  sidebarNav: [
    { href: "/", label: "Home", icon: <IconHome className="h-4 w-4" /> },
    { href: "/thinking", label: "Thinking", icon: <IconNotebook className="h-4 w-4" /> },
    { href: "/about", label: "About", icon: <IconUser className="h-4 w-4" /> },
  ] as NavItem[], // Assert type for stricter checking
  socialLinks: [
    // Updated order and icons
    { label: "LinkedIn", href: "#", icon: <IconBrandLinkedin className="h-4 w-4" /> },
    { label: "Instagram", href: "#", icon: <IconBrandInstagram className="h-4 w-4" /> },
    { label: "Spotify", href: "#", icon: <IconBrandSpotify className="h-4 w-4" /> },
  ] as SocialLink[], // Assert type for stricter checking
};

export type SiteConfig = typeof siteConfig;