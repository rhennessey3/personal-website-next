/**
 * API client for connecting to the backend
 */
import {
  Profile,
  CaseStudy,
  BlogPost,
  ContactSubmission,
  PaginatedResponse,
  AuthResponse
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/**
 * Base fetch function with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred while fetching data');
  }

  return response.json();
}

/**
 * Get profile information
 */
export async function getProfile(): Promise<Profile> {
  return fetchAPI<Profile>('/api/profile');
}

/**
 * Get profile information for admin
 */
export async function getAdminProfile(): Promise<Profile> {
  return fetchAPI<Profile>('/api/admin/profile', {
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Update profile information
 */
export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  return fetchAPI<Profile>('/api/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Get contact submissions
 */
export async function getContactSubmissions(params?: { limit?: number; page?: number }): Promise<PaginatedResponse<ContactSubmission>> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<PaginatedResponse<ContactSubmission>>(`/api/admin/contact${query}`, {
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Mark contact submission as read
 */
export async function markContactAsRead(id: string): Promise<ContactSubmission> {
  return fetchAPI<ContactSubmission>(`/api/admin/contact/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ read: true }),
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Delete contact submission
 */
export async function deleteContactSubmission(id: string): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>(`/api/admin/contact/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Get all case studies
 */
export async function getCaseStudies(params?: { limit?: number; page?: number }): Promise<PaginatedResponse<CaseStudy>> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<PaginatedResponse<CaseStudy>>(`/api/case-studies${query}`);
}

/**
 * Get a specific case study by slug
 */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy> {
  return fetchAPI<CaseStudy>(`/api/case-studies/${slug}`);
}

/**
 * Get all blog posts
 */
export async function getBlogPosts(params?: { limit?: number; page?: number }): Promise<PaginatedResponse<BlogPost>> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<PaginatedResponse<BlogPost>>(`/api/blog-posts${query}`);
}

/**
 * Get a specific blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  return fetchAPI<BlogPost>(`/api/blog-posts/${slug}`);
}

/**
 * Submit contact form
 */
export async function submitContactForm(data: { name: string; email: string; message: string }): Promise<ContactSubmission> {
  return fetchAPI<ContactSubmission>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Admin login
 */
export async function login(credentials: { email: string; password: string }): Promise<AuthResponse> {
  return fetchAPI<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Admin logout
 */
export async function logout(): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}

/**
 * Admin API Functions
 */

// Case Studies

/**
 * Get all case studies for admin (includes unpublished)
 */
export async function getAdminCaseStudies(params?: { limit?: number; page?: number }): Promise<PaginatedResponse<CaseStudy>> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<PaginatedResponse<CaseStudy>>(`/api/case-studies${query}`, {
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Get a specific case study by ID for admin
 */
export async function getAdminCaseStudyById(id: string): Promise<CaseStudy> {
  return fetchAPI<CaseStudy>(`/api/case-studies/${id}`, {
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Create a new case study
 */
export async function createCaseStudy(data: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>): Promise<CaseStudy> {
  return fetchAPI<CaseStudy>('/api/case-studies', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Update an existing case study
 */
export async function updateCaseStudy(id: string, data: Partial<CaseStudy>): Promise<CaseStudy> {
  return fetchAPI<CaseStudy>(`/api/case-studies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Delete a case study
 */
export async function deleteCaseStudy(id: string): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>(`/api/case-studies/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

// Blog Posts

/**
 * Get all blog posts for admin (includes unpublished)
 */
export async function getAdminBlogPosts(params?: { limit?: number; page?: number }): Promise<PaginatedResponse<BlogPost>> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<PaginatedResponse<BlogPost>>(`/api/blog-posts${query}`, {
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Get a specific blog post by ID for admin
 */
export async function getAdminBlogPostById(id: string): Promise<BlogPost> {
  return fetchAPI<BlogPost>(`/api/blog-posts/${id}`, {
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Create a new blog post
 */
export async function createBlogPost(data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  return fetchAPI<BlogPost>('/api/blog-posts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  return fetchAPI<BlogPost>(`/api/blog-posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>(`/api/blog-posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
}

/**
 * Upload an image to Supabase storage
 */
export async function uploadImage(file: File, bucket: string = 'case-studies'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  
  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${getCookieToken()}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }
  
  const data = await response.json();
  return data.url;
}

/**
 * Helper function to get the auth token from cookies
 */
function getCookieToken(): string {
  if (typeof document === 'undefined') return '';
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  
  if (!tokenCookie) return '';
  
  return tokenCookie.split('=')[1];
}