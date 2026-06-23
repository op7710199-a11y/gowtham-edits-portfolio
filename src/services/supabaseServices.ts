import { supabase } from '../lib/supabase';
import type {
  AboutSettings,
  Service,
  PricingTier,
  PortfolioItem,
  Testimonial,
  FaqItem,
  HeroSettings,
  Stat,
} from '../types/database';

// ─── About ──────────────────────────────────────────────────────────────────

export const aboutService = {
  async getPublic(): Promise<AboutSettings | null> {
    const { data, error } = await supabase
      .from('about_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as AboutSettings | null;
  },

  async getAdmin(): Promise<AboutSettings | null> {
    const { data, error } = await supabase
      .from('about_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as AboutSettings | null;
  },

  async upsert(payload: Partial<AboutSettings>): Promise<AboutSettings> {
    const { id, ...rest } = payload;
    if (id) {
      const { data, error } = await supabase
        .from('about_settings')
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as AboutSettings;
    }
    const { data, error } = await supabase
      .from('about_settings')
      .insert(rest)
      .select()
      .single();
    if (error) throw error;
    return data as AboutSettings;
  },
};

// ─── Services ───────────────────────────────────────────────────────────────

export const servicesService = {
  async getPublished(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as Service[];
  },

  async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as Service[];
  },

  async create(payload: Partial<Service>): Promise<Service> {
    const { id, created_at, updated_at, ...clean } = payload;
    const { data, error } = await supabase
      .from('services')
      .insert(clean)
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  },

  async update(id: string, patch: Partial<Service>): Promise<Service> {
    const { created_at, updated_at, ...clean } = patch;
    const { data, error } = await supabase
      .from('services')
      .update({ ...clean, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Pricing ────────────────────────────────────────────────────────────────

export const pricingService = {
  async getPublished(): Promise<PricingTier[]> {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('is_published', true)
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as PricingTier[];
  },

  async getAll(): Promise<PricingTier[]> {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as PricingTier[];
  },

  async create(payload: Partial<PricingTier>): Promise<PricingTier> {
    const { id, created_at, updated_at, ...clean } = payload;
    const { data, error } = await supabase
      .from('pricing_tiers')
      .insert(clean)
      .select()
      .single();
    if (error) throw error;
    return data as PricingTier[] as PricingTier;
  },

  async update(id: string, patch: Partial<PricingTier>): Promise<PricingTier> {
    const { created_at, updated_at, ...clean } = patch;
    const { data, error } = await supabase
      .from('pricing_tiers')
      .update({ ...clean, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as PricingTier;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('pricing_tiers').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Portfolio ──────────────────────────────────────────────────────────────

export const portfolioService = {
  async getPublished(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('is_published', true)
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as PortfolioItem[];
  },

  async getAll(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as PortfolioItem[];
  },

  async create(payload: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { id, created_at, updated_at, ...clean } = payload;
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(clean)
      .select()
      .single();
    if (error) throw error;
    return data as PortfolioItem;
  },

  async update(id: string, patch: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { created_at, updated_at, ...clean } = patch;
    const { data, error } = await supabase
      .from('portfolio_items')
      .update({ ...clean, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as PortfolioItem;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Testimonials ──────────────────────────────────────────────────────────

export const testimonialsService = {
  async getPublished(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  },

  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  },

  async create(payload: Partial<Testimonial>): Promise<Testimonial> {
    const { id, created_at, updated_at, ...clean } = payload;
    const { data, error } = await supabase
      .from('testimonials')
      .insert(clean)
      .select()
      .single();
    if (error) throw error;
    return data as Testimonial;
  },

  async update(id: string, patch: Partial<Testimonial>): Promise<Testimonial> {
    const { created_at, updated_at, ...clean } = patch;
    const { data, error } = await supabase
      .from('testimonials')
      .update({ ...clean, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Testimonial;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── FAQs ───────────────────────────────────────────────────────────────────

export const faqService = {
  async getPublished(): Promise<FaqItem[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_published', true)
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as FaqItem[];
  },

  async getAll(): Promise<FaqItem[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as FaqItem[];
  },

  async create(payload: Partial<FaqItem>): Promise<FaqItem> {
    const { id, created_at, updated_at, ...clean } = payload;
    const { data, error } = await supabase
      .from('faqs')
      .insert(clean)
      .select()
      .single();
    if (error) throw error;
    return data as FaqItem;
  },

  async update(id: string, patch: Partial<FaqItem>): Promise<FaqItem> {
    const { created_at, updated_at, ...clean } = patch;
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...clean, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as FaqItem;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Hero + Stats ───────────────────────────────────────────────────────────

export const heroService = {
  async get(): Promise<HeroSettings | null> {
    const { data, error } = await supabase
      .from('hero_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as HeroSettings | null;
  },

  async upsert(payload: Partial<HeroSettings>): Promise<HeroSettings> {
    const { id, ...rest } = payload;
    if (id) {
      const { data, error } = await supabase
        .from('hero_settings')
        .update(rest)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as HeroSettings;
    }
    const { data, error } = await supabase
      .from('hero_settings')
      .insert(rest)
      .select()
      .single();
    if (error) throw error;
    return data as HeroSettings;
  },
};

export const statsService = {
  async getPublished(): Promise<Stat[]> {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('is_published', true)
      .order('display_order');
    if (error) throw error;
    return (data ?? []) as Stat[];
  },
};

// ─── Site Settings ──────────────────────────────────────────────────────────

export const siteSettingsService = {
  async getAll(): Promise<Record<string, unknown>> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');
    if (error) throw error;
    const map: Record<string, unknown> = {};
    for (const row of data ?? []) {
      map[(row as { key: string }).key] = (row as { value: unknown }).value;
    }
    return map;
  },

  async getLogoUrl(): Promise<string> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_url')
      .maybeSingle();
    if (error) throw error;
    const val = data?.value;
    return typeof val === 'string' ? val : '';
  },

  async updateLogoUrl(url: string): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: JSON.stringify(url), updated_at: new Date().toISOString() })
      .eq('key', 'logo_url');
    if (error) throw error;
  },
};
