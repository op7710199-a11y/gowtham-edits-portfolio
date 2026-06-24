import type { UserRole } from './database';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  features: string[];
  ideal_for: string | null;
  delivery_time: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price_label: string;
  period: string;
  description: string | null;
  features: string[];
  delivery_note: string | null;
  is_popular: boolean;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  thumbnail_url: string;
  video_url: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  avatar_url: string | null;
  rating: number;
  content: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutSettings {
  id: string;
  profile_image_url: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  quote: string;
  quote_author: string;
  instagram_url: string;
  whatsapp_url: string;
  cta_text: string;
  is_published: boolean;
}

export interface HeroSettings {
  id: string;
  headline: string;
  subheadline: string;
  video_url: string | null;
  bg_image_url: string | null;
  cta_primary: string;
  cta_secondary: string;
  cta_whatsapp: string;
  is_video_enabled: boolean;
  updated_at: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'converted' | 'closed';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
  notes: string | null;
  updated_at: string;
  whatsapp: string | null;
  project_type: string | null;
  budget_range: string | null;
  delivery_deadline: string | null;
  source: string | null;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface SeoSettings {
  id: string;
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  keywords: string[];
  updated_at: string;
}
