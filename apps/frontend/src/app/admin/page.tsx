'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logout } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // In a real application, we would check if the user is authenticated
  // by verifying the token stored in cookies or local storage
  useEffect(() => {
    // This is a placeholder for authentication check
    const isAuthenticated = localStorage.getItem('auth_token');
    
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await logout();
      localStorage.removeItem('auth_token');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} disabled={loading}>
          {loading ? 'Logging out...' : 'Logout'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Studies</CardTitle>
            <CardDescription>Manage your case studies</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 5 published case studies and 2 drafts.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/case-studies">Manage Case Studies</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Manage your blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 8 published blog posts and 3 drafts.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/blog-posts">Manage Blog Posts</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Last updated: March 15, 2025</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/profile">Edit Profile</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Submissions</CardTitle>
            <CardDescription>View contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 3 unread messages.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/contact">View Messages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}