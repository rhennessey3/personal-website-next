export interface BlogPost {
  id: number;
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

export interface BlogPostTag {
  id: number;
  blog_post_id: number;
  tag_id: number;
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}