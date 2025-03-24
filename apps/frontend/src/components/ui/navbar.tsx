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
        "flex items-center space-x-4 lg:space-x-6 bg-white dark:bg-neutral-950 p-4 shadow-sm",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="text-xl font-bold text-neutral-900 dark:text-neutral-100"
      >
        Richard Hennessey
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        {items?.map((item) => (
          <Button key={item.href} variant="ghost" asChild>
            <Link
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}