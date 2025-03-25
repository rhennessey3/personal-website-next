'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Cookies from 'js-cookie';

// Define the CaseStudy type
interface AdminCaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  published: boolean;
  published_date?: string;
  created_at: string;
  updated_at: string;
}

// This is a placeholder for the actual API function
// In a real implementation, you would import this from your API client
const getCaseStudiesForAdmin = async (): Promise<{ data: AdminCaseStudy[], meta: { total: number, page: number, limit: number, totalPages: number } }> => {
  // Placeholder implementation
  return {
    data: [
      {
        id: '1',
        title: 'Enterprise SaaS Platform Redesign',
        slug: 'enterprise-saas-redesign',
        summary: 'A comprehensive redesign of a B2B SaaS platform that improved user satisfaction by 35% and reduced support tickets by 28%.',
        published: true,
        published_date: '2025-03-15',
        created_at: '2025-02-20',
        updated_at: '2025-03-15',
      },
      {
        id: '2',
        title: 'Mobile App User Onboarding Optimization',
        slug: 'mobile-app-onboarding',
        summary: 'How we increased activation rates by 42% through a data-driven redesign of the user onboarding experience for a consumer mobile application.',
        published: true,
        published_date: '2025-01-20',
        created_at: '2024-12-15',
        updated_at: '2025-01-20',
      },
      {
        id: '3',
        title: 'E-commerce Checkout Optimization',
        slug: 'ecommerce-checkout-optimization',
        summary: 'A case study on reducing cart abandonment by 23% through strategic UX improvements to the checkout flow.',
        published: true,
        published_date: '2024-11-05',
        created_at: '2024-10-10',
        updated_at: '2024-11-05',
      },
      {
        id: '4',
        title: 'Healthcare Portal Accessibility Improvements',
        slug: 'healthcare-portal-accessibility',
        summary: 'Draft case study on improving accessibility for a healthcare patient portal.',
        published: false,
        created_at: '2025-03-01',
        updated_at: '2025-03-10',
      }
    ],
    meta: {
      total: 4,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  };
};

export default function AdminCaseStudiesPage() {
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState<AdminCaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push('/admin/login?from=/admin/case-studies');
    }
  }, [router]);

  // Fetch case studies
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await getCaseStudiesForAdmin();
        setCaseStudies(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case studies');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Handle delete (placeholder)
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this case study? This action cannot be undone.')) {
      // In a real implementation, you would call your API to delete the case study
      console.log(`Deleting case study with ID: ${id}`);
      
      // Update the UI by removing the deleted case study
      setCaseStudies(caseStudies.filter(study => study.id !== id));
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
        <p>{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
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
                  >
                    Delete
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