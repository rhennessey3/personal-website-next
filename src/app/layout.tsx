import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { MobileHeader, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Footer } from "@/components/layout/Footer"; // Import the Footer component

// Use Geist fonts
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Richard Hennessey | Product Management & UX Strategy",
  description: "Personal website showcasing 10+ years of experience in product management and UX strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Make body a vertical flex container */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col`}
      >
        <SidebarProvider>
          {/* Render Mobile Header at the top */}
          <MobileHeader />

          {/* Make this container grow to fill remaining vertical space */}
          <div className="flex flex-1">
            {/* Render the extracted AppSidebar component */}
            <AppSidebar />

            {/* Main content area - Added pb-12 for fixed footer */}
            <main className="flex flex-col flex-1 p-8 md:p-16 pb-12 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat md:ml-[220px]"> {/* Changed margin from 260px to 220px */}
              {children}
            </main>
          </div> {/* Closing tag for the main flex container */}
        </SidebarProvider> {/* Closing tag for SidebarProvider */}

        {/* Render the Footer component */}
        <Footer />
      </body>
    </html>
  );
}
