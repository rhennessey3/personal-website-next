/**
 * Type definitions for API responses
 */

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  work_experiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
}

export interface WorkExperience {
  id: string;
  profile_id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  profile_id: string;
  degree: string;
  institution: string;
  year: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  profile_id: string;
  category: string;
  items: string[];
  order: number;
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featured_image_url?: string;
  published: boolean;
  published_date?: string;
  created_at: string;
  updated_at: string;
  sections?: CaseStudySection[];
  metrics?: CaseStudyMetric[];
  tags?: string[];
}

export interface CaseStudySection {
  id: string;
  case_study_id: string;
  section_type: 'challenge' | 'approach' | 'solution' | 'results' | 'learnings' | 'future_directions';
  section_order: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyMetric {
  id: string;
  case_study_id: string;
  metric_type: 'business_impact' | 'user_impact' | 'technical_achievements';
  label: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
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

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}