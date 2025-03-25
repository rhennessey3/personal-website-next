'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  sections?: {
    id: string;
    case_study_id: string;
    section_type: 'challenge' | 'approach' | 'solution' | 'results' | 'learnings' | 'future_directions';
    section_order: number;
    title: string;
    content: string;
  }[];
  metrics?: {
    id: string;
    case_study_id: string;
    metric_type: 'business_impact' | 'user_impact' | 'technical_achievements';
    label: string;
    value: string;
  }[];
  tags?: string[];
}

// Placeholder for API functions
const getCaseStudyById = async (id: string): Promise<AdminCaseStudy | null> => {
  // For new case studies
  if (id === 'new') {
    return {
      id: 'new',
      title: '',
      slug: '',
      summary: '',
      published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sections: [],
      metrics: [],
      tags: []
    };
  }

  // Mock data for existing case studies
  const mockCaseStudies: Record<string, AdminCaseStudy> = {
    '1': {
      id: '1',
      title: 'Enterprise SaaS Platform Redesign',
      slug: 'enterprise-saas-redesign',
      summary: 'A comprehensive redesign of a B2B SaaS platform that improved user satisfaction by 35% and reduced support tickets by 28%.',
      published: true,
      published_date: '2025-03-15',
      created_at: '2025-02-20',
      updated_at: '2025-03-15',
      sections: [
        {
          id: '1',
          case_study_id: '1',
          section_type: 'challenge',
          section_order: 1,
          title: 'The Challenge',
          content: 'The client\'s enterprise SaaS platform had grown organically over 5 years, resulting in an inconsistent user experience, declining user satisfaction, and increasing support costs.'
        },
        {
          id: '2',
          case_study_id: '1',
          section_type: 'approach',
          section_order: 2,
          title: 'Our Approach',
          content: 'We conducted extensive user research, including interviews with 25 customers, analysis of support tickets, and usability testing of the existing platform.'
        }
      ],
      metrics: [
        {
          id: '1',
          case_study_id: '1',
          metric_type: 'user_impact',
          label: 'User Satisfaction',
          value: '+35%'
        },
        {
          id: '2',
          case_study_id: '1',
          metric_type: 'business_impact',
          label: 'Support Tickets',
          value: '-28%'
        }
      ],
      tags: ['UX Design', 'Product Strategy', 'B2B']
    }
  };

  return mockCaseStudies[id] || null;
};

const saveCaseStudy = async (caseStudy: AdminCaseStudy): Promise<AdminCaseStudy> => {
  // In a real implementation, this would send the data to your API
  console.log('Saving case study:', caseStudy);
  
  // Simulate API response
  return {
    ...caseStudy,
    updated_at: new Date().toISOString()
  };
};

export default function CaseStudyEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  
  const [caseStudy, setCaseStudy] = useState<AdminCaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push(`/admin/login?from=/admin/case-studies/${id}`);
    }
  }, [router, id]);

  // Fetch case study data
  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const data = await getCaseStudyById(id);
        setCaseStudy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load case study');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCaseStudy(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCaseStudy(prev => prev ? { ...prev, [name]: checked } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseStudy) return;

    setSaving(true);
    setError(null);

    try {
      await saveCaseStudy(caseStudy);
      router.push('/admin/case-studies');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save case study');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading case study...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
        <Button className="mt-4" onClick={() => router.push('/admin/case-studies')}>
          Back to Case Studies
        </Button>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Case Study Not Found</h3>
        <p>The requested case study could not be found.</p>
        <Button className="mt-4" onClick={() => router.push('/admin/case-studies')}>
          Back to Case Studies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{isNew ? 'Create New Case Study' : 'Edit Case Study'}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/admin/case-studies')}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Case Study'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={caseStudy.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                value={caseStudy.slug}
                onChange={handleInputChange}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                required
              />
              <p className="text-xs text-neutral-500">
                Used in the URL: /thinking/{caseStudy.slug || '[slug]'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={caseStudy.summary}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={caseStudy.published}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Published
              </label>
            </div>
          </CardContent>
        </Card>

        {/* In a complete implementation, you would add sections for:
            - Case study sections (challenge, approach, solution, etc.)
            - Metrics
            - Tags
            - Featured image upload
        */}
        
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Note</h3>
          <p>
            This is a simplified form. In a complete implementation, you would add sections for managing case study content, 
            metrics, tags, and image uploads.
          </p>
        </div>
      </form>
    </div>
  );
}