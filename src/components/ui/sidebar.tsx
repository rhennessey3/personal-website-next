"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react"; // Import useEffect
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation"; // Import usePathname
// Import icons from @tabler/icons-react again
import { IconMenu2, IconX } from "@tabler/icons-react";
import RickHennesseyLogo from '@/assets/rickhennesseylogo.svg'; // Import desktop logo
import MobileRhLogo from '@/assets/mobielrh.svg'; // Import mobile logo

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

const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-screen px-4 py-4 hidden md:flex flex-col bg-white dark:bg-neutral-950 w-[120px] border-r border-neutral-200 dark:border-neutral-800 fixed top-0 left-0", // Increased base width by 20px
          className
        )}
        animate={{
          width: "140px", // Increased animated width by 20px
        }}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

const MobileHeader = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden items-center bg-neutral-100 dark:bg-neutral-800 w-full", // Removed justify-between
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
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname(); // Get current pathname
  // Effect to close sidebar on route change
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Re-run effect when pathname changes

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
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
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
              {children}
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
        "flex items-center justify-center group/sidebar py-2", // Changed justify-start to justify-center
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