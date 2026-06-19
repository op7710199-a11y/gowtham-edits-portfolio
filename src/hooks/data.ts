import { useEffect, useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Service,
  PricingTier,
  PortfolioItem,
  Testimonial,
  FaqItem,
} from '../types/database';
import {
  SERVICES as SEED_SERVICES,
  PRICING as SEED_PRICING,
  PROJECTS as SEED_PROJECTS,
  TESTIMONIALS as SEED_TESTIMONIALS,
  FAQS as SEED_FAQS,
} from './seed';

export interface PublicData {
  services: Service[];
  pricing: PricingTier[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  loading: boolean;
  error: string | null;
}

export function usePublicData(): PublicData {
  const [data, setData] = useState<Omit<PublicData, 'loading' | 'error'>>({
    services: [],
    pricing: [],
    portfolio: [],
    testimonials: [],
    faqs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [svc, prc, port, test, faq] = await Promise.all([
          supabase.from('services').select('*').eq('is_published', true).order('display_order'),
          supabase.from('pricing_tiers').select('*').eq('is_published', true).order('display_order'),
          supabase.from('portfolio_items').select('*').eq('is_published', true).order('display_order'),
          supabase.from('testimonials').select('*').eq('is_published', true).order('display_order'),
          supabase.from('faqs').select('*').eq('is_published', true).order('display_order'),
        ]);

        if (!active) return;

        if (svc.error || prc.error || port.error || test.error || faq.error) {
          throw new Error(
            svc.error?.message ||
              prc.error?.message ||
              port.error?.message ||
              test.error?.message ||
              faq.error?.message ||
              'Failed to load content'
          );
        }

        setData({
          services: (svc.data ?? []) as Service[],
          pricing: (prc.data ?? []) as PricingTier[],
          portfolio: (port.data ?? []) as PortfolioItem[],
          testimonials: (test.data ?? []) as Testimonial[],
          faqs: (faq.data ?? []) as FaqItem[],
        });
      } catch (e) {
        if (!active) return;
        console.warn('Supabase content load failed, using seed data:', e);
        setError(null);
        setData({
          services: SEED_SERVICES as unknown as Service[],
          pricing: SEED_PRICING as unknown as PricingTier[],
          portfolio: SEED_PROJECTS as unknown as PortfolioItem[],
          testimonials: SEED_TESTIMONIALS as unknown as Testimonial[],
          faqs: SEED_FAQS as unknown as FaqItem[],
        });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading, error };
}

export function useAdminTable<T extends { id: string; display_order?: number }>(
  table: string
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = supabase.from(table).select('*');
      const hasOrder = ['services', 'pricing_tiers', 'portfolio_items', 'testimonials', 'faqs'].includes(table);
      const { data, error: err } = hasOrder
        ? await query.order('display_order')
        : await query.order('created_at', { ascending: false });
      if (err) throw err;
      setRows((data ?? []) as T[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (payload: Partial<T>): Promise<T> => {
    const { data, error: err } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();
    if (err) throw err;
    await fetchAll();
    return data as T;
  };

  const update = async (id: string, patch: Partial<T>): Promise<T> => {
    const { data, error: err } = await supabase
      .from(table)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (err) throw err;
    await fetchAll();
    return data as T;
  };

  const remove = async (id: string): Promise<void> => {
    const { error: err } = await supabase.from(table).delete().eq('id', id);
    if (err) throw err;
    await fetchAll();
  };

  return { rows, loading, error, refetch: fetchAll, create, update, remove };
}

export function useActivityLog() {
  const log = useCallback(
    async (
      action: string,
      entity: string,
      entityId?: string,
      details?: Record<string, unknown>
    ) => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;
        await supabase.from('activity_logs').insert({
          user_id: session.user.id,
          action,
          entity,
          entity_id: entityId ?? null,
          details: details ?? {},
        });
      } catch {
        // Non-critical — silently ignore log failures
      }
    },
    []
  );
  return log;
}
