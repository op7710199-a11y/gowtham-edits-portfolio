import { useEffect, useState } from 'react';
import { Save, RefreshCw, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/admin/AdminUI';
import { Field, Toggle } from './PortfolioManager';
import { useActivityLog } from '../../hooks/data';
import type { HeroSettings } from '../../hooks/useHeroSettings';

const DEFAULT: HeroSettings = {
  id: '',
  headline: 'Transforming Footage Into Cinematic Stories',
  subheadline: 'Premium video editing for weddings, reels, bike films & brands.',
  video_url: '',
  bg_image_url: 'https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1920',
  cta_primary: 'View Portfolio',
  cta_secondary: 'Get Free Quote',
  cta_whatsapp: 'WhatsApp Me',
  is_video_enabled: false,
};

export function HeroSettingsPage() {
  const [form, setForm] = useState<HeroSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const log = useActivityLog();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error: err } = await supabase.from('hero_settings').select('*').limit(1).maybeSingle();
        if (!active) return;
        if (err) {
          console.error('HeroSettings fetch error:', err.message);
          setError('Failed to load hero settings: ' + err.message);
          setLoading(false);
          return;
        }
        if (data) setForm(data as HeroSettings);
        setLoading(false);
      } catch (e) {
        if (!active) return;
        console.error('HeroSettings fetch exception:', e);
        setError('Failed to load hero settings. Please refresh the page.');
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const save = async () => {
    setSaving(true); setError(null);
    try {
      if (form.id) {
        const { error: err } = await supabase.from('hero_settings')
          .update({ ...form, updated_at: new Date().toISOString() })
          .eq('id', form.id);
        if (err) throw err;
      } else {
        const { data, error: err } = await supabase.from('hero_settings').insert(form).select().maybeSingle();
        if (err) throw err;
        if (data) setForm(data as HeroSettings);
      }
      await log('update', 'hero_settings', form.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('HeroSettings save error:', e);
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Hero Settings"
        subtitle="Control the headline, video/image background, and CTA buttons shown in the hero section."
        action={
          <button type="button" onClick={save} disabled={saving || loading} className="btn-primary py-2.5 disabled:opacity-50">
            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        }
      />
      <div className="p-6 space-y-8">
        {saved && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Hero settings saved successfully.</div>}
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />)}</div>
        ) : (
          <>
            {/* Copy */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Headline & Copy</h2>
              <Field label="Main Headline" value={form.headline} onChange={(v) => setForm((f) => ({ ...f, headline: v }))} placeholder="Transforming Footage Into Cinematic Stories" />
              <Field label="Subheadline" value={form.subheadline} onChange={(v) => setForm((f) => ({ ...f, subheadline: v }))} multiline />
            </div>

            {/* Background */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Background Media</h2>
              <Toggle
                label="Use Video Background (instead of image)"
                checked={form.is_video_enabled}
                onChange={(v) => setForm((f) => ({ ...f, is_video_enabled: v }))}
              />
              <Field label="Background Image URL" value={form.bg_image_url} onChange={(v) => setForm((f) => ({ ...f, bg_image_url: v }))} placeholder="https://..." />
              {form.bg_image_url && (
                <img src={form.bg_image_url} alt="Preview" className="h-32 w-full rounded-xl object-cover opacity-60"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              {form.is_video_enabled && (
                <Field label="Video URL (MP4 hosted URL)" value={form.video_url} onChange={(v) => setForm((f) => ({ ...f, video_url: v }))} placeholder="https://example.com/hero.mp4" />
              )}
            </div>

            {/* CTAs */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">CTA Button Text</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Primary CTA" value={form.cta_primary} onChange={(v) => setForm((f) => ({ ...f, cta_primary: v }))} placeholder="View Portfolio" />
                <Field label="Secondary CTA" value={form.cta_secondary} onChange={(v) => setForm((f) => ({ ...f, cta_secondary: v }))} placeholder="Get Free Quote" />
                <Field label="WhatsApp CTA" value={form.cta_whatsapp} onChange={(v) => setForm((f) => ({ ...f, cta_whatsapp: v }))} placeholder="WhatsApp Me" />
              </div>
            </div>

            {/* Preview link */}
            <div className="flex justify-end">
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold-300 hover:text-gold-100 transition-colors">
                <Eye className="h-4 w-4" /> Preview live site
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
