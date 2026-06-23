import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { HeroSettings, Stat } from '../types/database';

interface StatRow {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  display_order: number;
  is_published: boolean;
}

const DEFAULT_HERO: HeroSettings = {
  id: '',
  headline: 'Transforming Footage Into Cinematic Stories',
  subheadline: 'Premium video editing for weddings, reels, and cinematic content — crafted to move people.',
  video_url: '',
  bg_image_url: 'https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  cta_primary: 'View Portfolio',
  cta_secondary: 'Get a Quote',
  cta_whatsapp: 'Chat on WhatsApp',
  is_video_enabled: false,
};

export interface HeroData {
  hero: HeroSettings;
  stats: StatRow[];
  loading: boolean;
}

export function useHeroSettings(): HeroData {
  const [hero, setHero] = useState<HeroSettings>(DEFAULT_HERO);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [heroRes, statsRes] = await Promise.allSettled([
          supabase.from('hero_settings').select('*').limit(1).maybeSingle(),
          supabase.from('stats').select('*').eq('is_published', true).order('display_order'),
        ]);

        if (!active) return;

        if (heroRes.status === 'fulfilled' && heroRes.value.data) {
          const d = heroRes.value.data as Partial<HeroSettings>;
          setHero({
            ...DEFAULT_HERO,
            ...d,
            headline: d.headline ?? DEFAULT_HERO.headline,
            subheadline: d.subheadline ?? DEFAULT_HERO.subheadline,
            bg_image_url: d.bg_image_url ?? DEFAULT_HERO.bg_image_url,
            video_url: d.video_url ?? '',
            cta_primary: d.cta_primary ?? DEFAULT_HERO.cta_primary,
            cta_secondary: d.cta_secondary ?? DEFAULT_HERO.cta_secondary,
            cta_whatsapp: d.cta_whatsapp ?? DEFAULT_HERO.cta_whatsapp,
            is_video_enabled: d.is_video_enabled ?? false,
          });
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          setStats((statsRes.value.data ?? []) as StatRow[]);
        }
      } catch {
        // Use defaults
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { hero, stats, loading };
}
