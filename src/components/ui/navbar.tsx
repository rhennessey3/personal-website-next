import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
  }[]
}

export function Navbar({ className, items, ...props }: NavbarProps) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-4 lg:space-x-6 bg-[#181613] px-12 py-4 shadow-sm", // Increased horizontal padding
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="text-xl font-bold text-[#F2F2EB]" // Changed text color
      >
        Richard Hennessey
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        {items?.map((item) => (
          // Removed Button wrapper, render Link directly
          <Link
            key={item.href} // Key moved to Link
            href={item.href}
            className="text-sm font-medium text-[#F2F2EB] transition-colors hover:text-[#d3c343] px-3 py-2 rounded-md" // Added padding/rounding for spacing/hover area
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}