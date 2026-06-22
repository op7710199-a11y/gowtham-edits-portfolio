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
  const [error] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const safe = async <T,>(p: PromiseLike<{ data: T[] | null; error: { message: string } | null }>, fallback: T[]): Promise<T[]> => {
        try {
          const { data, error } = await p;
          if (error) return fallback;
          return (data ?? fallback) as T[];
        } catch {
          return fallback;
        }
      };

      const [services, pricing, portfolio, testimonials, faqs] = await Promise.all([
        safe(
          supabase.from('services').select('*').eq('is_published', true).order('display_order'),
          SEED_SERVICES as unknown as Service[]
        ),
        safe(
          supabase.from('pricing_tiers').select('*').eq('is_published', true).order('display_order'),
          SEED_PRICING as unknown as PricingTier[]
        ),
        safe(
          supabase.from('portfolio_items').select('*').eq('is_published', true).order('display_order'),
          SEED_PROJECTS as unknown as PortfolioItem[]
        ),
        safe(
          supabase.from('testimonials').select('*').eq('is_published', true).order('display_order'),
          SEED_TESTIMONIALS as unknown as Testimonial[]
        ),
        safe(
          supabase.from('faqs').select('*').eq('is_published', true).order('display_order'),
          SEED_FAQS as unknown as FaqItem[]
        ),
      ]);

      if (!active) return;

      setData({ services, pricing, portfolio, testimonials, faqs });
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading, error };
}

/** Remove auto-generated fields before insert/update so Postgres can apply defaults. */
function stripGenerated<T extends Record<string, unknown>>(payload: Partial<T>): Partial<T> {
  const { id, created_at, updated_at, ...rest } = payload as Record<string, unknown>;
  if (id !== undefined && id !== '' && id !== null) (rest as Record<string, unknown>).id = id;
  return rest as Partial<T>;
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
    const clean = stripGenerated<T>(payload);
    const { data, error: err } = await supabase
      .from(table)
      .insert(clean)
      .select()
      .single();
    if (err) throw err;
    await fetchAll();
    return data as T;
  };

  const update = async (id: string, patch: Partial<T>): Promise<T> => {
    const clean = stripGenerated<T>(patch);
    const { data, error: err } = await supabase
      .from(table)
      .update({ ...clean, updated_at: new Date().toISOString() })
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
