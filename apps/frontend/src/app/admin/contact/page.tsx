'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { getContactSubmissions, markContactAsRead, deleteContactSubmission } from '@/lib/api';
import { ContactSubmission } from '@/lib/types';
import { useApi } from '@/hooks/useApi';

export default function AdminContactPage() {
  const router = useRouter();
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isMarking, setIsMarking] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Use the useApi hook to fetch contact submissions
  const { data, loading, error } = useApi(
    () => getContactSubmissions({ limit: 50, page: 1 }),
    { initialData: { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 0 } } }
  );

  // Function to manually refresh the data
  const refreshData = async () => {
    try {
      const result = await getContactSubmissions({ limit: 50, page: 1 });
      setContactSubmissions(result.data);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to refresh contact submissions');
    }
  };

  // Update local state when API data changes
  useEffect(() => {
    if (data?.data) {
      setContactSubmissions(data.data);
    }
  }, [data]);

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push('/admin/login?from=/admin/contact');
    }
  }, [router]);

  // Handle mark as read
  const handleMarkAsRead = async (id: string) => {
    setIsMarking(id);
    setActionError(null);
    
    try {
      await markContactAsRead(id);
      // Update the UI by marking the submission as read
      setContactSubmissions(contactSubmissions.map(submission => 
        submission.id === id ? { ...submission, read: true } : submission
      ));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark contact submission as read');
    } finally {
      setIsMarking(null);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact submission? This action cannot be undone.')) {
      setIsDeleting(id);
      setActionError(null);
      
      try {
        await deleteContactSubmission(id);
        // Update the UI by removing the deleted submission
        setContactSubmissions(contactSubmissions.filter(submission => submission.id !== id));
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Failed to delete contact submission');
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
          <p className="text-lg">Loading contact submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Loading Contact Submissions</h3>
        <p>{error.message}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (actionError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{actionError}</p>
        <Button className="mt-4" onClick={() => setActionError(null)}>
          Dismiss
        </Button>
      </div>
    );
  }

  const unreadCount = contactSubmissions.filter(submission => !submission.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-neutral-500">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button onClick={() => refreshData()}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contactSubmissions.length > 0 ? (
          contactSubmissions.map((submission) => (
            <Card 
              key={submission.id} 
              className={!submission.read ? 'border-l-4 border-l-primary' : ''}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {submission.name}
                      {!submission.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          New
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-neutral-500 mt-1">{submission.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    {!submission.read && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkAsRead(submission.id)}
                        disabled={isMarking === submission.id}
                      >
                        {isMarking === submission.id ? 'Marking...' : 'Mark as Read'}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(submission.id)}
                      disabled={isDeleting === submission.id}
                    >
                      {isDeleting === submission.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                  {submission.message}
                </div>
                <div className="mt-4 text-xs text-neutral-500">
                  Received: {new Date(submission.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-md">
            <p className="text-neutral-500 dark:text-neutral-400">No contact submissions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}