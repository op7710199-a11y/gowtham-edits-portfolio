import { useEffect, useRef, useState } from 'react';
import { Upload, RefreshCw, Save } from 'lucide-react';
import { PageHeader } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { useActivityLog } from '../../hooks/data';

type IconName = 'Film' | 'Heart' | 'Sun' | 'Bike' | 'Smartphone' | 'Youtube' | 'Palette' | 'Sparkles' | 'Wand2' | 'Users' | 'Award' | 'Clock' | 'CheckCircle' | 'MessageCircle' | 'Instagram' | 'Send' | 'ArrowUpRight';

const ICON_OPTIONS: IconName[] = ['Film', 'Heart', 'Sun', 'Bike', 'Smartphone', 'Youtube', 'Palette', 'Sparkles', 'Wand2', 'Users', 'Award', 'Clock', 'CheckCircle', 'MessageCircle', 'Instagram', 'Send', 'ArrowUpRight'];

interface HeroForm {
  headline: string;
  subheadline: string;
  video_url: string;
  bg_image_url: string;
  cta_primary: string;
  cta_secondary: string;
  cta_whatsapp: string;
  is_video_enabled: boolean;
}

const EMPTY_FORM: HeroForm = {
  headline: '',
  subheadline: '',
  video_url: '',
  bg_image_url: '',
  cta_primary: '',
  cta_secondary: '',
  cta_whatsapp: '',
  is_video_enabled: false,
};

export function HeroSettingsPage() {
  const [form, setForm] = useState<HeroForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const log = useActivityLog();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error: err } = await supabase.from('hero_settings').select('*').limit(1).maybeSingle();
        if (!active) return;
        if (err) {
          setError('Failed to load hero settings: ' + err.message);
          setLoading(false);
          return;
        }
        if (data) setForm(data as HeroForm);
        setLoading(false);
      } catch (e) {
        if (!active) return;
        setError('Failed to load hero settings. Please refresh.');
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `hero-bg-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('about-assets').upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('about-assets').getPublicUrl(fileName);
      return pub.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data: existing } = await supabase.from('hero_settings').select('id').limit(1).maybeSingle();
      if (existing) {
        const { error: err } = await supabase.from('hero_settings').update(form).eq('id', existing.id);
        if (err) throw err;
        try { await log('update', 'hero_settings', existing.id); } catch { /* non-critical */ }
      } else {
        const { data, error: err } = await supabase.from('hero_settings').insert(form).select().maybeSingle();
        if (err) throw err;
        try { await log('create', 'hero_settings', data?.id); } catch { /* non-critical */ }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Hero Settings" subtitle="Configure the homepage hero section." />
        <div className="space-y-4 p-6">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-white/[0.04]" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Hero Settings" subtitle="Configure the homepage hero section." />
      <div className="p-6">
        {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        {saved && <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">Saved successfully!</div>}
        <div className="card-glass max-w-3xl space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Headline</label>
            <input type="text" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Subheadline</label>
            <textarea value={form.subheadline} onChange={(e) => setForm({ ...form, subheadline: e.target.value })} rows={2} className="w-full resize-none rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Background Image URL</label>
            <div className="flex gap-2">
              <input type="text" value={form.bg_image_url} onChange={(e) => setForm({ ...form, bg_image_url: e.target.value })} className="flex-1 rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-ghost px-4 py-2.5"><Upload className="h-4 w-4" />{uploading ? 'Uploading...' : 'Upload'}</button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { try { const url = await uploadImage(file); setForm({ ...form, bg_image_url: url }); } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed'); } } }} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Video URL</label>
            <input type="text" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Primary CTA</label>
              <input type="text" value={form.cta_primary} onChange={(e) => setForm({ ...form, cta_primary: e.target.value })} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Secondary CTA</label>
              <input type="text" value={form.cta_secondary} onChange={(e) => setForm({ ...form, cta_secondary: e.target.value })} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">WhatsApp CTA</label>
              <input type="text" value={form.cta_whatsapp} onChange={(e) => setForm({ ...form, cta_whatsapp: e.target.value })} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input type="checkbox" checked={form.is_video_enabled} onChange={(e) => setForm({ ...form, is_video_enabled: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-ink-900" />
            Enable video background
          </label>
          <button type="button" onClick={save} disabled={saving} className="btn-primary w-full py-3.5"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save Hero Settings'}</button>
        </div>
      </div>
    </div>
  );
}
