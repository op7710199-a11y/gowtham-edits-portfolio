export type UserRole = 'super_admin' | 'admin' | 'editor' | 'user';

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
  description: string;
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
  description: string;
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
  description: string;
  thumbnail_url: string;
  video_url: string;
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
  client_role: string;
  avatar_url: string;
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
  phone: string;
  service: string;
  message: string;
  status: InquiryStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  label: string | null;
  category: string | null;
  updated_at: string;
}

export interface SeoSetting {
  id: string;
  page_path: string;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  keywords: string[];
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  profile?: Pick<Profile, 'full_name' | 'email' | 'avatar_url'> | null;
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
  updated_at: string;
}

export interface HeroSettings {
  id: string;
  headline: string;
  subheadline: string;
  video_url: string;
  bg_image_url: string;
  cta_primary: string;
  cta_secondary: string;
  cta_whatsapp: string;
  is_video_enabled: boolean;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  display_order: number;
  is_published: boolean;
}
