export interface CaseStudy {
  id: number;
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
  id: number;
  case_study_id: number;
  section_type: 'challenge' | 'approach' | 'solution' | 'results' | 'learnings' | 'future_directions';
  section_order: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyMetric {
  id: number;
  case_study_id: number;
  section_type: 'business_impact' | 'user_impact' | 'technical_achievements';
  label: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyTag {
  id: number;
  case_study_id: number;
  tag_id: number;
}