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