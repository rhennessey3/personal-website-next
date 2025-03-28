import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Richard Hennessey | Product Management & UX Strategy",
  description: "Personal website showcasing 10+ years of experience in product management and UX strategy",
};

const navItems = [
  { href: "/", title: "Home" },
  { href: "/thinking", title: "Thinking" },
  { href: "/about", title: "About" },
  { href: "/admin", title: "Admin" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 dark:bg-neutral-900`}
      >
        <Navbar items={navItems} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
