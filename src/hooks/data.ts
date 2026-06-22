import { useEffect, useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Service, PricingTier, PortfolioItem, Testimonial, FaqItem, Inquiry, ActivityLog, Stat,
} from '../types/database';
import {
  PUBLIC_TABLES,
} from './seed';

// ============================================================================
// PUBLIC DATA HOOK — anonymous reads of published content
// ============================================================================

export function usePublicData() {
  const [data, setData] = useState<{
    services: Service[];
    pricing: PricingTier[];
    portfolio: PortfolioItem[];
    testimonials: Testimonial[];
    faqs: FaqItem[];
    stats: Stat[];
    loading: boolean;
  }>({
    services: [], pricing: [], portfolio: [], testimonials: [], faqs: [], stats: [], loading: true,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [svc, pri, port, tes, faq, stat] = await Promise.all([
          supabase.from('services').select('*').eq('is_published', true).order('display_order'),
          supabase.from('pricing_tiers').select('*').eq('is_published', true).order('display_order'),
          supabase.from('portfolio_items').select('*').eq('is_published', true).order('display_order'),
          supabase.from('testimonials').select('*').eq('is_published', true).order('display_order'),
          supabase.from('faqs').select('*').eq('is_published', true).order('display_order'),
          supabase.from('stats').select('*').eq('is_published', true).order('display_order'),
        ]);
        if (!active) return;
        setData({
          services: (svc.data as Service[]) || [],
          pricing: (pri.data as PricingTier[]) || [],
          portfolio: (port.data as PortfolioItem[]) || [],
          testimonials: (tes.data as Testimonial[]) || [],
          faqs: (faq.data as FaqItem[]) || [],
          stats: (stat.data as Stat[]) || [],
          loading: false,
        });
      } catch {
        if (active) setData((d) => ({ ...d, loading: false }));
      }
    })();
    return () => { active = false; };
  }, []);

  return data;
}

// ============================================================================
// ADMIN TABLE HOOK — generic CRUD for admin panels
// ============================================================================

/** Remove auto-generated fields before insert/update so Postgres can apply defaults. */
function stripGenerated<T extends Record<string, unknown>>(payload: Partial<T>): Partial<T> {
  const { id, created_at, updated_at, ...rest } = payload as Record<string, unknown>;
  // Drop empty-string id (from EMPTY form constants) — DB will gen_random_uuid()
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
      let query = supabase.from(table).select('*');
      // Only order by display_order if the table has it
      if (PUBLIC_TABLES.includes(table)) {
        query = query.order('display_order');
      } else {
        query = query.order('created_at', { ascending: false });
      }
      const { data, error: err } = await query;
      if (err) throw err;
      setRows((data as T[]) || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

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

  const reorder = async (id: string, newOrder: number): Promise<void> => {
    const { error: err } = await supabase
      .from(table)
      .update({ display_order: newOrder })
      .eq('id', id);
    if (err) throw err;
    await fetchAll();
  };

  return { rows, loading, error, create, update, remove, reorder, refresh: fetchAll };
}

// ============================================================================
// ACTIVITY LOG HOOK
// ============================================================================

export function useActivityLog() {
  return useCallback(async (
    action: string,
    entity: string,
    entityId?: string,
    details?: Record<string, unknown>
  ) => {
    try {
      await supabase.from('activity_logs').insert({
        action,
        entity,
        entity_id: entityId || null,
        details: details || null,
      });
    } catch {
      // non-blocking — activity log failures shouldn't break the main operation
    }
  }, []);
}

// Re-export PUBLIC_TABLES for convenience
export { PUBLIC_TABLES };
