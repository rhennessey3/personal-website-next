'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logout } from '@/lib/api';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);

  // Check if the user is authenticated
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    const userInfo = localStorage.getItem('user');
    
    if (!authToken) {
      router.push('/admin/login');
    } else if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }
  }, [router]);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await logout();
      // Remove auth token from cookies
      Cookies.remove('auth_token', { path: '/' });
      // Remove user info from localStorage
      localStorage.removeItem('user');
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
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {user && (
            <p className="text-sm text-neutral-500">Logged in as: {user.email} ({user.role})</p>
          )}
        </div>
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