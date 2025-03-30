import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font'; // Import from 'geist/font'
import "./globals.css";
import { Navbar } from "@/components/ui/navbar"; // Import Navbar
// Removed WavyBackground import
// Removed Sidebar imports
// import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
// import {
//   IconHome,
//   IconNotebook,
//   IconUser,
//   IconSettings,
// } from "@tabler/icons-react";
// import Link from "next/link";
// import { motion } from "framer-motion";

// Directly use the imported font objects for their variable names
// const geistSans = GeistSans; // No need to call it like a function
// const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Richard Hennessey | Product Management & UX Strategy",
  description: "Personal website showcasing 10+ years of experience in product management and UX strategy",
};

// Define nav items for the top Navbar
const topNavItems = [
  { href: "/", title: "Home" },
  { href: "/thinking", title: "Thinking" },
  { href: "/about", title: "About" },
  // Add other items as needed, e.g., { href: "/admin", title: "Admin" }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900`} // Explicitly added font-sans
      >
        {/* Add Navbar at the top */}
        <Navbar items={topNavItems} />

        {/* Main content area takes remaining space */}
        <main className="flex-1 p-8 md:p-16 bg-[#F2F2EB]"> {/* Doubled padding */}
          {/* WavyBackground component removed */}
          {/* Actual page content */}
          {children}
        </main>
      </body>
    </html>
  );
}
