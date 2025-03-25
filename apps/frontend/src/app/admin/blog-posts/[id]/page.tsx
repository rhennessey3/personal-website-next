'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Cookies from 'js-cookie';
import { Upload, X } from 'lucide-react';
import { getAdminBlogPostById, createBlogPost, updateBlogPost, uploadImage as uploadImageApi } from '@/lib/api';
import { BlogPost } from '@/lib/types';

// Define the AdminBlogPost type for the component
interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image_url?: string;
  published: boolean;
  published_date?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

// Function to get a blog post by ID or create a new one
const getBlogPostById = async (id: string): Promise<AdminBlogPost | null> => {
  // For new blog posts
  if (id === 'new') {
    return {
      id: 'new',
      title: '',
      slug: '',
      summary: '',
      content: '',
      published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: []
    };
  }

  try {
    // Get existing blog post from API
    const blogPost = await getAdminBlogPostById(id);
    return {
      ...blogPost,
      id: blogPost.id.toString()
    } as AdminBlogPost;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Function to save a blog post
const saveBlogPost = async (blogPost: AdminBlogPost): Promise<AdminBlogPost> => {
  try {
    if (blogPost.id === 'new') {
      // Create new blog post
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...blogPostData } = blogPost;
      const newBlogPost = await createBlogPost(blogPostData as Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>);
      return {
        ...newBlogPost,
        id: newBlogPost.id.toString()
      } as AdminBlogPost;
    } else {
      // Update existing blog post
      const updatedBlogPost = await updateBlogPost(blogPost.id, blogPost as unknown as Partial<BlogPost>);
      return {
        ...updatedBlogPost,
        id: updatedBlogPost.id.toString()
      } as AdminBlogPost;
    }
  } catch (error) {
    console.error('Error saving blog post:', error);
    throw error;
  }
};

// Function to upload an image
const uploadImage = async (file: File): Promise<string> => {
  try {
    return await uploadImageApi(file, 'blog-posts');
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default function BlogPostEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';
  
  const [blogPost, setBlogPost] = useState<AdminBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check authentication
  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    if (!authToken) {
      router.push(`/admin/login?from=/admin/blog-posts/${id}`);
    }
  }, [router, id]);

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const data = await getBlogPostById(id);
        setBlogPost(data);
        if (data?.tags) {
          setTagsInput(data.tags.join(', '));
        }
        if (data?.featured_image_url) {
          setPreviewUrl(data.featured_image_url);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogPost(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setBlogPost(prev => prev ? { ...prev, [name]: checked } : null);
  };

  // Tags handler
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    
    // Update tags array by splitting the comma-separated string
    const tagsArray = e.target.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setBlogPost(prev => prev ? { ...prev, tags: tagsArray } : null);
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
    if (!selectedFile || !blogPost) return;
    
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
      
      // Update the blog post
      setBlogPost(prev => {
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
    
    setBlogPost(prev => {
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
    if (!blogPost) return;

    setSaving(true);
    setError(null);

    try {
      // If there's a selected file that hasn't been uploaded yet, upload it first
      if (selectedFile && !uploadProgress) {
        const imageUrl = await uploadImage(selectedFile);
        blogPost.featured_image_url = imageUrl;
      }

      await saveBlogPost(blogPost);
      router.push('/admin/blog-posts');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save blog post');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
        <Button className="mt-4" onClick={() => router.push('/admin/blog-posts')}>
          Back to Blog Posts
        </Button>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-md my-8">
        <h3 className="text-lg font-medium mb-2">Blog Post Not Found</h3>
        <p>The requested blog post could not be found.</p>
        <Button className="mt-4" onClick={() => router.push('/admin/blog-posts')}>
          Back to Blog Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{isNew ? 'Create New Blog Post' : 'Edit Blog Post'}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/admin/blog-posts')}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Blog Post'}
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
                value={blogPost.title}
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
                value={blogPost.slug}
                onChange={handleInputChange}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950"
                required
              />
              <p className="text-xs text-neutral-500">
                Used in the URL: /thinking/{blogPost.slug || '[slug]'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={blogPost.summary}
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
                checked={blogPost.published}
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
            <CardDescription>Upload a featured image for this blog post</CardDescription>
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
                    Upload an image to be displayed with this blog post
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

        {/* Blog Post Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Write your blog post content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <textarea
                id="content"
                name="content"
                value={blogPost.content}
                onChange={handleInputChange}
                rows={15}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950 font-mono"
                required
                placeholder="Write your blog post content here..."
              />
              <p className="text-xs text-neutral-500">
                Supports Markdown formatting
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add tags to categorize this blog post</CardDescription>
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
              
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
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
            {saving ? 'Saving...' : 'Save Blog Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}