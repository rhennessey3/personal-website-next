"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react"; // Import useEffect
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation"; // Import usePathname and useSearchParams
// Import icons from @tabler/icons-react again
import { IconMenu2, IconX } from "@tabler/icons-react";
import RickHennesseyLogo from '@/assets/rickhennesseylogo.svg'; // Import desktop logo
import MobileRhLogo from '@/assets/mobielrh.svg'; // Import mobile logo
// Import new content components
import { DesktopNavContent } from "@/components/layout/DesktopNavContent";
import { MobileNavContent } from "@/components/layout/MobileNavContent";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// SidebarBody no longer needs props as it doesn't pass them down
const SidebarBody: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  return (
     <>
       {isMobile ? (
         <div> {/* Use div instead of fragment */}
           <MobileHeader />
           <MobileSidebar />
         </div>
       ) : (
         <DesktopSidebar />
       )}
     </>
   );
};

const DesktopSidebar = ({
  className,
  // Removed children prop
  ...props
}: Omit<React.ComponentProps<"div">, "children">) => { // Use Omit to remove children from type
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-screen px-4 py-4 flex flex-col bg-white dark:bg-neutral-950 w-[140px] border-r border-neutral-200 dark:border-neutral-800 fixed top-0 left-0", // Increased width from 120px to 140px
          className
        )}
        {...props} /* Removed animate prop */
      >
        <DesktopNavContent /> {/* Render specific content */}
      </div>
    </>
  );
};

const MobileHeader = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row items-center bg-neutral-100 dark:bg-neutral-800 w-full", // Removed red border
        className
      )}
      {...props}
    >
      {/* Removed inner div wrapper */}
        {/* Replace text with logo, set explicit height */}
        <Link href="/" aria-label="Homepage" className="flex items-center"> {/* Wrap logo in link, removed mr-auto */}
          <MobileRhLogo className="h-8 w-auto text-neutral-800 dark:text-neutral-200" /> {/* Use mobile logo, added text color for light/dark mode */}
        </Link>
        {/* Use Tabler IconMenu2 icon */}
        <IconMenu2
          className="text-neutral-800 dark:text-neutral-200 h-6 w-6 ml-auto" // Added ml-auto
          onClick={() => setOpen(!open)}
        />
      {/* Removed closing tag for inner div */}
    </div>
  );
};

const MobileSidebar = ({
  className,
  // Removed children prop
  ...props
}: Omit<React.ComponentProps<"div">, "children">) => { // Use Omit to remove children from type
  const { open, setOpen } = useSidebar();
  const pathname = usePathname(); // Get current pathname
  const searchParams = useSearchParams(); // Get search params
  // Effect to close sidebar on route change (pathname or search params)
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]); // Re-run effect when pathname or searchParams changes

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between", // Removed red border
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                {/* Use Tabler IconX icon */}
                <IconX />
              </div>
              <MobileNavContent /> {/* Render specific content */}
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
};

// Remove the onClick handler from SidebarLink as it's now handled by the effect
const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate, setOpen } = useSidebar(); // Destructure setOpen
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-center group/sidebar py-2", // Removed red border
        className
      )}
      {...props} // Removed onClick handler
    >
      {/* {link.icon} // Icon removed */}
      {/* Removed text-sm, added font-semibold to match CardTitle */}
      <span
        className="text-neutral-900 dark:text-neutral-100 font-semibold group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </span>
    </Link>
  );
};

export { SidebarProvider, useSidebar, SidebarBody, DesktopSidebar, MobileHeader, MobileSidebar, SidebarLink };