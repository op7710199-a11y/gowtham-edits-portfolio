import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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

export interface StatRow {
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
  subheadline: 'Premium video editing for weddings, reels, bike films & brands. Film-grade results, delivered on time.',
  video_url: '',
  bg_image_url: 'https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1920',
  cta_primary: 'View Portfolio',
  cta_secondary: 'Get Free Quote',
  cta_whatsapp: 'WhatsApp Me',
  is_video_enabled: false,
};

export function useHeroSettings() {
  const [hero, setHero] = useState<HeroSettings>(DEFAULT_HERO);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [heroRes, statsRes] = await Promise.all([
          supabase.from('hero_settings').select('*').limit(1).maybeSingle(),
          supabase.from('stats').select('*').eq('is_published', true).order('display_order'),
        ]);
        if (!active) return;
        if (heroRes.data) setHero(heroRes.data as HeroSettings);
        if (statsRes.data) setStats(statsRes.data as StatRow[]);
      } catch {
        // Use defaults
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { hero, stats, loading };
}
