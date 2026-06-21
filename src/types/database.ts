export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  features: string[];
  ideal_for: string;
  delivery_time: string;
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
  delivery_note: string;
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

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  label: string | null;
  category: string;
  updated_at: string;
}

export interface SeoSetting {
  id: string;
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  keywords: string[];
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
  profile?: Pick<Profile, 'full_name' | 'email'>;
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
  cta_text: string;
  is_published: boolean;
  updated_at: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';
