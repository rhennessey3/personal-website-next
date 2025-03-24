export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  profile_image_url?: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
  work_experiences?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
}

export interface WorkExperience {
  id: number;
  profile_id: number;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date?: string;
  description: string;
  key_achievements: string[];
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  profile_id: number;
  institution: string;
  degree: string;
  start_date: string;
  end_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  profile_id: number;
  category: string;
  name: string;
  proficiency: number; // 1-5 scale
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}