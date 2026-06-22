import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useActivityLog } from './data';

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

const DEFAULT_ABOUT: AboutSettings = {
  id: '',
  profile_image_url: '',
  name: 'Gowtham',
  title: 'Cinematic Video Editor',
  bio: 'I am a cinematic video editor specializing in weddings, haldi celebrations, pre-wedding stories, bike cinematic cuts, and high-retention reels and social content. My approach is simple: story first, rhythm second, polish always.',
  skills: ['DaVinci Resolve', 'Premiere Pro', 'After Effects', 'Color Grading', 'Sound Design', 'Motion Graphics'],
  quote: 'Every frame tells a story. Every cut moves it forward.',
  quote_author: 'Gowtham',
  instagram_url: '',
  whatsapp_url: '',
  cta_text: "Let's Work Together",
  is_published: true,
};

const ABOUT_TABLE = 'about_settings';

export function useAboutSettings() {
  const [about, setAbout] = useState<AboutSettings>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from(ABOUT_TABLE).select('*').limit(1).maybeSingle();
        if (!active) return;
        if (error) return;
        if (data) {
          const parsed = data as AboutSettings & { skills?: unknown };
          setAbout({
            ...DEFAULT_ABOUT,
            ...parsed,
            skills: Array.isArray(parsed.skills) ? (parsed.skills as string[]) : DEFAULT_ABOUT.skills,
          });
        }
      } catch {
        // keep defaults — placeholder content shows instead of empty space
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { about, loading };
}

export function useAboutAdmin() {
  const [form, setForm] = useState<AboutSettings>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const log = useActivityLog();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase.from(ABOUT_TABLE).select('*').limit(1).maybeSingle();
        if (!active) return;
        if (data) {
          const parsed = data as AboutSettings & { skills?: unknown };
          setForm({
            ...DEFAULT_ABOUT,
            ...parsed,
            skills: Array.isArray(parsed.skills) ? (parsed.skills as string[]) : [],
          });
        }
      } catch {
        // use defaults
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `profile-${Date.now()}.${ext}`;
      const filePath = `profiles/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from('profile-images').getPublicUrl(filePath);
      return pub.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const save = async (imageOverrideUrl?: string) => {
    setSaving(true);
    setError(null);
    try {
      const { id, ...rest } = form;
      const payload = {
        ...rest,
        profile_image_url: imageOverrideUrl ?? form.profile_image_url,
        updated_at: new Date().toISOString(),
      };

      if (form.id) {
        const { error: err } = await supabase.from(ABOUT_TABLE).update(payload).eq('id', form.id);
        if (err) throw err;
        setForm((f) => ({ ...f, profile_image_url: payload.profile_image_url }));
      } else {
        const { data, error: err } = await supabase.from(ABOUT_TABLE).insert(payload).select().single();
        if (err) throw err;
        if (data) setForm({ ...(data as AboutSettings), skills: Array.isArray((data as AboutSettings).skills) ? (data as AboutSettings).skills : [] });
      }

      await log('update', 'about_settings', form.id || undefined);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return { form, setForm, loading, saving, saved, error, uploading, uploadImage, save };
}
