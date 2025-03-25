'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { Plus, Trash, ArrowUp, ArrowDown, Upload, X } from 'lucide-react';

// Define the CaseStudy type
interface AdminCaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featured_image_url?: string;
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

// Define the section and metric types explicitly for better type safety
type SectionType = 'challenge' | 'approach' | 'solution' | 'results' | 'learnings' | 'future_directions';
type MetricType = 'business_impact' | 'user_impact' | 'technical_achievements';

// Section type options
const sectionTypeOptions = [
  { value: 'challenge', label: 'Challenge' },
  { value: 'approach', label: 'Approach' },
  { value: 'solution', label: 'Solution' },
  { value: 'results', label: 'Results' },
  { value: 'learnings', label: 'Learnings' },
  { value: 'future_directions', label: 'Future Directions' }
];

// Metric type options
const metricTypeOptions = [
  { value: 'business_impact', label: 'Business Impact' },
  { value: 'user_impact', label: 'User Impact' },
  { value: 'technical_achievements', label: 'Technical Achievements' }
];

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
      featured_image_url: 'https://placehold.co/600x400/png',
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

// Placeholder for image upload function
const uploadImage = async (file: File): Promise<string> => {
  // In a real implementation, this would upload the image to Supabase storage
  console.log('Uploading file:', file.name);
  
  // Simulate upload and return a placeholder URL
  return 'https://placehold.co/600x400/png';
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
  const [tagsInput, setTagsInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // New section and metric form state
  const [newSection, setNewSection] = useState({
    section_type: 'challenge' as SectionType,
    title: '',
    content: ''
  });
  
  const [newMetric, setNewMetric] = useState({
    metric_type: 'business_impact' as MetricType,
    label: '',
    value: ''
  });

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
        if (data?.tags) {
          setTagsInput(data.tags.join(', '));
        }
        if (data?.featured_image_url) {
          setPreviewUrl(data.featured_image_url);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load case study');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id]);

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCaseStudy(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCaseStudy(prev => prev ? { ...prev, [name]: checked } : null);
  };

  // Tags handler
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    
    // Update tags array by splitting the comma-separated string
    const tagsArray = e.target.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setCaseStudy(prev => prev ? { ...prev, tags: tagsArray } : null);
  };

  // Section handlers
  const handleNewSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSection(prev => ({ ...prev, [name]: value }));
  };

  const addSection = () => {
    if (!caseStudy) return;
    if (!newSection.title || !newSection.content) return;

    const newSectionObj = {
      id: `temp-${Date.now()}`, // In a real app, the backend would assign an ID
      case_study_id: caseStudy.id,
      section_type: newSection.section_type,
      section_order: caseStudy.sections?.length || 0,
      title: newSection.title,
      content: newSection.content
    };

    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sections: [...(prev.sections || []), newSectionObj]
      };
    });

    // Reset the form
    setNewSection({
      section_type: 'challenge',
      title: '',
      content: ''
    });
  };

  const updateSection = (index: number, field: string, value: string) => {
    if (!caseStudy?.sections) return;

    const updatedSections = [...caseStudy.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };

    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!caseStudy?.sections) return;
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === caseStudy.sections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSections = [...caseStudy.sections];
    
    // Swap the sections
    [updatedSections[index], updatedSections[newIndex]] = [updatedSections[newIndex], updatedSections[index]];
    
    // Update the section_order values
    updatedSections.forEach((section, i) => {
      section.section_order = i;
    });

    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const removeSection = (index: number) => {
    if (!caseStudy?.sections) return;

    const updatedSections = caseStudy.sections.filter((_, i) => i !== index);
    
    // Update the section_order values
    updatedSections.forEach((section, i) => {
      section.section_order = i;
    });

    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  // Metric handlers
  const handleNewMetricChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMetric(prev => ({ ...prev, [name]: value }));
  };

  const addMetric = () => {
    if (!caseStudy) return;
    if (!newMetric.label || !newMetric.value) return;

    const newMetricObj = {
      id: `temp-${Date.now()}`, // In a real app, the backend would assign an ID
      case_study_id: caseStudy.id,
      metric_type: newMetric.metric_type,
      label: newMetric.label,
      value: newMetric.value
    };

    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        metrics: [...(prev.metrics || []), newMetricObj]
      };
    });

    // Reset the form
    setNewMetric({
      metric_type: 'business_impact',
      label: '',
      value: ''
    });
  };

  const updateMetric = (index: number, field: string, value: string) => {
    if (!caseStudy?.metrics) return;

    const updatedMetrics = [...caseStudy.metrics];
    updatedMetrics[index] = {
      ...updatedMetrics[index],
      [field]: value
    };

    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        metrics: updatedMetrics
      };
    });
  };

  const removeMetric = (index: number) => {
    if (!caseStudy?.metrics) return;

    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        metrics: prev.metrics?.filter((_, i) => i !== index)
      };
    });
  };

  // Image upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !caseStudy) return;
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload the image
      const imageUrl = await uploadImage(selectedFile);
      
      // Update the case study
      setCaseStudy(prev => {
        if (!prev) return null;
        return {
          ...prev,
          featured_image_url: imageUrl
        };
      });
      
      // Clear the progress
      clearInterval(interval);
      setUploadProgress(100);
      
      // Reset after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setSelectedFile(null);
      }, 1000);
      
    } catch {
      // Catch any errors without assigning to a variable
      setError('Failed to upload image');
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setUploadProgress(0);
    
    setCaseStudy(prev => {
      if (!prev) return null;
      return {
        ...prev,
        featured_image_url: undefined
      };
    });
  };

  // Main form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseStudy) return;

    setSaving(true);
    setError(null);

    try {
      // If there's a selected file that hasn't been uploaded yet, upload it first
      if (selectedFile && !uploadProgress) {
        const imageUrl = await uploadImage(selectedFile);
        caseStudy.featured_image_url = imageUrl;
      }

      await saveCaseStudy(caseStudy);
      router.push('/admin/case-studies');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save case study');
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
        {/* Basic Information */}
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

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>Upload a featured image for this case study</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewUrl && (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Featured image preview" 
                    className="max-h-64 rounded-md object-cover"
                  />
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="absolute top-2 right-2 h-8 w-8 p-0" 
                    onClick={removeImage} 
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {!previewUrl && (
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-md p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-neutral-400" />
                  <p className="mt-2 text-sm text-neutral-500">
                    Upload an image to be displayed with this case study
                  </p>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="featured_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="featured_image"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  >
                    Browse Files
                  </label>
                  
                  {selectedFile && uploadProgress === 0 && (
                    <Button 
                      type="button" 
                      onClick={handleImageUpload}
                    >
                      Upload Image
                    </Button>
                  )}
                  
                  {selectedFile && (
                    <span className="text-sm text-neutral-500">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                
                {uploadProgress > 0 && (
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Case Study Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Sections</CardTitle>
            <CardDescription>Add content sections to your case study</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing sections */}
            {caseStudy.sections && caseStudy.sections.length > 0 ? (
              <div className="space-y-4">
                {caseStudy.sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <select
                          value={section.section_type}
                          onChange={(e) => updateSection(index, 'section_type', e.target.value as SectionType)}
                          className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                        >
                          {sectionTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-neutral-500">
                          Order: {section.section_order + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => moveSection(index, 'up')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {caseStudy.sections && index < (caseStudy.sections.length - 1) && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => moveSection(index, 'down')}
                            type="button"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeSection(index)}
                          type="button"
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Section Title</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        rows={5}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-neutral-500">
                No sections added yet. Use the form below to add your first section.
              </div>
            )}

            {/* Add new section form */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3 mt-4">
              <h4 className="font-medium">Add New Section</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Section Type</label>
                <select
                  name="section_type"
                  value={newSection.section_type}
                  onChange={handleNewSectionChange}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                >
                  {sectionTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Section Title</label>
                <input
                  type="text"
                  name="title"
                  value={newSection.title}
                  onChange={handleNewSectionChange}
                  placeholder="e.g., The Challenge"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea
                  name="content"
                  value={newSection.content}
                  onChange={handleNewSectionChange}
                  rows={5}
                  placeholder="Enter the content for this section..."
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <Button 
                type="button" 
                onClick={addSection}
                className="w-full"
                disabled={!newSection.title || !newSection.content}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
            <CardDescription>Add key metrics and results to highlight</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Existing metrics */}
            {caseStudy.metrics && caseStudy.metrics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.metrics.map((metric, index) => (
                  <div 
                    key={metric.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <select
                        value={metric.metric_type}
                        onChange={(e) => updateMetric(index, 'metric_type', e.target.value as MetricType)}
                        className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      >
                        {metricTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => removeMetric(index)}
                        type="button"
                        className="h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Label</label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => updateMetric(index, 'label', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Value</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => updateMetric(index, 'value', e.target.value)}
                        className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-neutral-500">
                No metrics added yet. Use the form below to add your first metric.
              </div>
            )}

            {/* Add new metric form */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3 mt-4">
              <h4 className="font-medium">Add New Metric</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Metric Type</label>
                <select
                  name="metric_type"
                  value={newMetric.metric_type}
                  onChange={handleNewMetricChange}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                >
                  {metricTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Label</label>
                <input
                  type="text"
                  name="label"
                  value={newMetric.label}
                  onChange={handleNewMetricChange}
                  placeholder="e.g., User Satisfaction"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <input
                  type="text"
                  name="value"
                  value={newMetric.value}
                  onChange={handleNewMetricChange}
                  placeholder="e.g., +35%"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
              </div>
              
              <Button 
                type="button" 
                onClick={addMetric}
                className="w-full"
                disabled={!newMetric.label || !newMetric.value}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Metric
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add tags to categorize this case study</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="e.g., UX Design, Product Strategy, B2B"
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                />
                <p className="text-xs text-neutral-500">
                  Separate tags with commas (e.g., &quot;UX Design, Product Strategy, B2B&quot;)
                </p>
              </div>
              
              {caseStudy.tags && caseStudy.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {caseStudy.tags.map((tag, index) => (
                    <div 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-800 border border-primary-200"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Saving...' : 'Save Case Study'}
          </Button>
        </div>
      </form>
    </div>
  );
}
