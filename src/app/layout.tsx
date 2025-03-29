import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Temporarily commented out
import "./globals.css";
import { Navbar } from "@/components/ui/navbar"; // Import Navbar
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

// const geistSans = Geist({ // Temporarily commented out
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({ // Temporarily commented out
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
        className={`antialiased min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900`} // Removed font variables
      >
        {/* Add Navbar at the top */}
        <Navbar items={topNavItems} />

        {/* Main content area takes remaining space */}
        <main className="flex-1 p-4 md:p-8"> {/* Added flex-1 */}
          {children}
        </main>
      </body>
    </html>
  );
}
