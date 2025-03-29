import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Removed Navbar import
// import { Navbar } from "@/components/ui/navbar";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"; // Import Sidebar components
import {
  IconHome,
  IconNotebook,
  IconUser,
  IconSettings,
} from "@tabler/icons-react"; // Import icons
import Link from "next/link"; // Added Link import for Logo example
import { motion } from "framer-motion"; // Added motion import for Logo example

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

// Updated navItems with icons
const navItems = [
  { href: "/", label: "Home", icon: <IconHome className="h-4 w-4" /> },
  { href: "/thinking", label: "Thinking", icon: <IconNotebook className="h-4 w-4" /> },
  { href: "/about", label: "About", icon: <IconUser className="h-4 w-4" /> },
  { href: "/admin", label: "Admin", icon: <IconSettings className="h-4 w-4" /> }, // Example icon
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> {/* No h-full */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 dark:bg-neutral-900`}
      >
        {/* Wrap content in a flex container for sidebar layout */}
        <div className="flex"> {/* No h-full */}
          {/* Sidebar component */}
          <Sidebar>
            <SidebarBody className="justify-between gap-10"> {/* Use SidebarBody */}
              <div className="flex flex-1 flex-col">
                {/* Optional: Logo/Title within SidebarBody if needed */}
                {/* <Logo /> */}
                <div className="mt-8 flex flex-col gap-2">
                  {navItems.map((item, idx) => (
                    <SidebarLink key={idx} link={item} />
                  ))}
                </div>
              </div>
              {/* Optional: Footer section in sidebar */}
              {/* <div>
                <SidebarLink link={{ label: "Settings", href: "/settings", icon: <IconSettings className="h-4 w-4" /> }} />
              </div> */}
            </SidebarBody>
          </Sidebar>

          {/* Main content area with margin adjusted for sidebar */}
          {/* md:ml-60 corresponds to the SIDEBAR_WIDTH defined in sidebar.tsx */}
          <main className="flex-1 md:ml-60 p-4 md:p-8"> {/* Adjusted padding/margin */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

// Optional: Logo component if you want it inside the sidebar body
// export const Logo = () => {
//   return (
//     <Link
//       href="/"
//       className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
//     >
//       <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
//       <motion.span
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="font-medium text-black dark:text-white whitespace-pre"
//       >
//         Aceternity UI
//       </motion.span>
//     </Link>
//   );
// };
