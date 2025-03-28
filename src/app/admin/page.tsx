'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logout, getAdminCaseStudies, getAdminBlogPosts, getContactSubmissions, getAdminProfile } from '@/lib/api';
import Cookies from 'js-cookie';
// Types are used in the API responses but not directly in this file

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [caseStudies, setCaseStudies] = useState<{ published: number; drafts: number }>({ published: 0, drafts: 0 });
  const [blogPosts, setBlogPosts] = useState<{ published: number; drafts: number }>({ published: 0, drafts: 0 });
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [profileLastUpdated, setProfileLastUpdated] = useState<string>('');
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Check if the user is authenticated
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    const userInfo = localStorage.getItem('user');
    
    if (!authToken) {
      router.push('/admin/login');
    } else if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
        // Fetch dashboard data
        fetchDashboardData();
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }
  }, [router]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setDataLoading(true);
    setDataError(null);

    try {
      // Fetch case studies
      const caseStudiesResponse = await getAdminCaseStudies({ limit: 100, page: 1 });
      const publishedCaseStudies = caseStudiesResponse.data.filter(cs => cs.published).length;
      const draftCaseStudies = caseStudiesResponse.data.filter(cs => !cs.published).length;
      setCaseStudies({ published: publishedCaseStudies, drafts: draftCaseStudies });

      // Fetch blog posts
      const blogPostsResponse = await getAdminBlogPosts({ limit: 100, page: 1 });
      const publishedBlogPosts = blogPostsResponse.data.filter(bp => bp.published).length;
      const draftBlogPosts = blogPostsResponse.data.filter(bp => !bp.published).length;
      setBlogPosts({ published: publishedBlogPosts, drafts: draftBlogPosts });

      // Fetch contact submissions
      const contactResponse = await getContactSubmissions({ limit: 100, page: 1 });
      const unreadCount = contactResponse.data.filter(cs => !cs.read).length;
      setUnreadMessages(unreadCount);

      // Fetch profile
      const profileResponse = await getAdminProfile();
      const lastUpdated = new Date(profileResponse.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setProfileLastUpdated(lastUpdated);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDataError('Failed to load dashboard data. Please try again later.');
    } finally {
      setDataLoading(false);
    }
  };

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
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => fetchDashboardData()} disabled={dataLoading}>
            Refresh
          </Button>
          <Button variant="outline" onClick={handleLogout} disabled={loading}>
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>

      {dataError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p>{dataError}</p>
        </div>
      )}

      {dataLoading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Studies</CardTitle>
              <CardDescription>Manage your case studies</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You have {caseStudies.published} published case {caseStudies.published === 1 ? 'study' : 'studies'} and {caseStudies.drafts} {caseStudies.drafts === 1 ? 'draft' : 'drafts'}.</p>
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
              <p>You have {blogPosts.published} published blog {blogPosts.published === 1 ? 'post' : 'posts'} and {blogPosts.drafts} {blogPosts.drafts === 1 ? 'draft' : 'drafts'}.</p>
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
              <p>Last updated: {profileLastUpdated || 'Not updated yet'}</p>
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
              {unreadMessages > 0 ? (
                <p>You have {unreadMessages} unread {unreadMessages === 1 ? 'message' : 'messages'}.</p>
              ) : (
                <p>No unread messages.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/contact">View Messages</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}