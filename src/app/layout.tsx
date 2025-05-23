import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { SidebarProvider, SidebarBody } from "@/components/ui/sidebar"; // Added SidebarBody import
// Removed AppSidebar import
import { Footer } from "@/components/layout/Footer"; // Import the Footer component

// Use Geist fonts
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Richard Hennessey | Product Management & UX Strategy",
  description: "Rick Hennessey, 10+ years of experience in product management and UX Strategy",
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
          {/* SidebarBody now handles conditional rendering of Desktop/Mobile */}
          <SidebarBody />

          {/* Make this container grow to fill remaining vertical space */}
          <div className="flex flex-1">
            {/* AppSidebar removed, SidebarBody handles rendering */}

            {/* Main content area - Padding moved to inner div, Added pb-12 for fixed footer */}
            <main className="flex flex-col flex-1 pb-12 bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat md:ml-[140px]"> {/* Adjusted margin for wider sidebar, removed p-8 md:p-16 */}
              {/* Default padded wrapper */}
              <div className="p-8 md:p-16 flex-1"> {/* Added flex-1 to allow content to grow */}
                {children}
              </div>
            </main>
          </div> {/* Closing tag for the main flex container */}
        </SidebarProvider> {/* Closing tag for SidebarProvider */}

        {/* Render the Footer component */}
        <Footer />
      </body>
    </html>
  );
}
