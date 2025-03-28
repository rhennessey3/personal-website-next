import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Richard Hennessey',
  description: 'Admin dashboard for managing content',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-neutral-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-xl font-bold">
              Admin Dashboard
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/admin/case-studies" className="hover:text-neutral-300">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/admin/blog-posts" className="hover:text-neutral-300">
                    Blog Posts
                  </Link>
                </li>
                <li>
                  <Link href="/admin/profile" className="hover:text-neutral-300">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/admin/contact" className="hover:text-neutral-300">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-neutral-300">
                    View Site
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-neutral-100 dark:bg-neutral-900 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Richard Hennessey. Admin Dashboard.
        </div>
      </footer>
    </div>
  );
}