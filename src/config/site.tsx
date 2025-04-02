import React from "react"; // Import React for JSX
import {
  IconHome,
  IconNotebook,
  IconUser,
  // IconBrandLinkedin removed
  // IconBrandInstagram removed
  // IconBrandSpotify removed
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
  name: "Rick Hennessey", // Updated name
  title: "Product Management", // Updated title
  logo: "/rh.svg", // Path to logo
  resumeUrl: "/resume", // Updated resume link to internal page
  sidebarNav: [
    // { href: "/", label: "Home", icon: <IconHome className="h-4 w-4" /> }, // Removed Home link
    { href: "/thinking", label: "Thinking", icon: <IconNotebook className="h-4 w-4" /> }, // Keep nav icons small
    { href: "/about", label: "About", icon: <IconUser className="h-4 w-4" /> }, // Keep nav icons small
  ] as NavItem[], // Assert type for stricter checking
  socialLinks: [
    // Updated LinkedIn href
    { label: "LinkedIn", href: "https://www.linkedin.com/in/richardhennessey3", icon: <img src="/linkedin.svg" alt="LinkedIn" className="h-5 w-5" /> },
    // Updated Instagram href
    { label: "Instagram", href: "https://www.instagram.com/rhennessey3/", icon: <img src="/instagram.svg" alt="Instagram" className="h-5 w-5" /> },
    // Updated Spotify href
    { label: "Spotify", href: "https://open.spotify.com/user/rhennessey?si=732fa48c9b2c4233", icon: <img src="/spotify.svg" alt="Spotify" className="h-5 w-5" /> },
    // Updated Email icon size
    { label: "Email", href: "#", icon: <img src="/email.svg" alt="Email" className="h-5 w-5" /> },
  ] as SocialLink[], // Assert type for stricter checking
};

export type SiteConfig = typeof siteConfig;