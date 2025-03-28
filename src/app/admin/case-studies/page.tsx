'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { getAdminCaseStudies, deleteCaseStudy } from '@/lib/api';
import { CaseStudy } from '@/lib/types';
import { useApi } from '@/hooks/useApi';

export default function AdminCaseStudiesPage() {
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Use the useApi hook to fetch case studies
  const { data, loading, error } = useApi(
    () => getAdminCaseStudies({ limit: 20, page: 1 }),
    { initialData: { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } } }
  );

  // Update local state when API data changes
  useEffect(() => {
    if (data?.data) {
      setCaseStudies(data.data);
    }
  }, [data]);

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push('/admin/login?from=/admin/case-studies');
    }
  }, [router]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this case study? This action cannot be undone.')) {
      setIsDeleting(id);
      setDeleteError(null);
      
      try {
        await deleteCaseStudy(id);
        // Update the UI by removing the deleted case study
        setCaseStudies(caseStudies.filter(study => study.id !== id));
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : 'Failed to delete case study');
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
          <p className="text-lg">Loading case studies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error Loading Case Studies</h3>
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
        <h3 className="text-lg font-medium mb-2">Error Deleting Case Study</h3>
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
        <h1 className="text-3xl font-bold">Case Studies</h1>
        <Button asChild>
          <Link href="/admin/case-studies/new">Create New Case Study</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {caseStudies.map((study) => (
          <Card key={study.id} className={!study.published ? 'border-dashed border-neutral-300' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{study.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {study.published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published: {study.published_date ? new Date(study.published_date).toLocaleDateString() : 'Unknown date'}
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
                    <Link href={`/admin/case-studies/${study.id}`}>Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/thinking/${study.slug}`} target="_blank">View</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(study.id)}
                    disabled={isDeleting === study.id}
                  >
                    {isDeleting === study.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{study.summary}</p>
              <div className="mt-2 text-xs text-neutral-500">
                Last updated: {new Date(study.updated_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}