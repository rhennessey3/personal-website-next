'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { getAdminBlogPosts, deleteBlogPost } from '@/lib/api';
import { BlogPost } from '@/lib/types';
import { useApi } from '@/hooks/useApi';

export default function AdminBlogPostsPage() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Use the useApi hook to fetch blog posts
  const { data, loading, error } = useApi(
    () => getAdminBlogPosts({ limit: 20, page: 1 }),
    { initialData: { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } } }
  );

  // Update local state when API data changes
  useEffect(() => {
    if (data?.data) {
      setBlogPosts(data.data);
    }
  }, [data]);

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push('/admin/login?from=/admin/blog-posts');
    }
  }, [router]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      setIsDeleting(id);
      setDeleteError(null);
      
      try {
        await deleteBlogPost(id);
        // Update the UI by removing the deleted blog post
        setBlogPosts(blogPosts.filter(post => post.id.toString() !== id));
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : 'Failed to delete blog post');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Loading Blog Posts</h3>
        <p>{error.message}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (deleteError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Deleting Blog Post</h3>
        <p>{deleteError}</p>
        <Button className="mt-4" onClick={() => setDeleteError(null)}>
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog-posts/new">Create New Blog Post</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {blogPosts.map((post) => (
          <Card key={post.id} className={!post.published ? 'border-dashed border-neutral-300' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {post.published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published: {post.published_date ? new Date(post.published_date).toLocaleDateString() : 'Unknown date'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/blog-posts/${post.id}`}>Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/thinking/${post.slug}`} target="_blank">View</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(post.id.toString())}
                    disabled={isDeleting === post.id.toString()}
                  >
                    {isDeleting === post.id.toString() ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{post.summary}</p>
              <div className="mt-2 text-xs text-neutral-500">
                Last updated: {new Date(post.updated_at).toLocaleDateString()}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {blogPosts.length === 0 && (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-md">
            <p className="text-neutral-500 dark:text-neutral-400">No blog posts found. Create your first blog post to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}