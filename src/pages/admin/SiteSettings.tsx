import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/admin/AdminUI';
import { Field } from './PortfolioManager';
import { Save, RefreshCw } from 'lucide-react';
import { useActivityLog } from '../../hooks/data';
import type { SiteSetting } from '../../types/database';

const CATEGORIES = [
  { key: 'branding', label: 'Brand' },
  { key: 'contact', label: 'Contact' },
  { key: 'social', label: 'Social Media' },
  { key: 'seo', label: 'SEO' },
  { key: 'stats', label: 'Stats' },
];

export function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const log = useActivityLog();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error: err } = await supabase.from('site_settings').select('*').order('category');
        if (!active) return;
        if (err) {
          setError('Failed to load settings: ' + err.message);
          setLoading(false);
          return;
        }
        setSettings((data ?? []) as SiteSetting[]);
        setLoading(false);
      } catch {
        if (!active) return;
        setError('Failed to load settings. Please refresh the page.');
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const getValue = (s: SiteSetting) => {
    if (s.key in edited) return edited[s.key];
    const raw = s.value;
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'number') return String(raw);
    return JSON.stringify(raw).replace(/^"|"$/g, '');
  };

  const saveAll = async () => {
    setSaving(true); setError(null);
    try {
      for (const [key, rawVal] of Object.entries(edited)) {
        const setting = settings.find((s) => s.key === key);
        if (!setting) continue;
        let value: unknown;
        const orig = setting.value;
        if (typeof orig === 'number') value = Number(rawVal);
        else if (typeof orig === 'boolean') value = rawVal === 'true';
        else value = rawVal;
        const { error: updErr } = await supabase
          .from('site_settings')
          .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
          .eq('key', key);
        if (updErr) throw new Error(`Failed to save "${key}": ${updErr.message}`);
      }
      try { await log('update', 'site_settings', undefined, { keys: Object.keys(edited) }); } catch { /* non-critical */ }
      setSaved(true);
      setEdited({});
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: settings.filter((s) => s.category === cat.key),
  }));

  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="Brand, contact info, social links, SEO, and statistics — all in one place."
        action={
          <button type="button" onClick={saveAll} disabled={saving || !hasChanges} className="btn-primary py-2.5 disabled:opacity-50">
            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        }
      />
      <div className="p-6 space-y-8">
        {saved && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Settings saved successfully.</div>}
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {hasChanges && (
          <div className="rounded-xl border border-gold-500/30 bg-gold-500/[0.05] px-4 py-3 text-sm text-gold-200">
            {Object.keys(edited).length} unsaved change{Object.keys(edited).length > 1 ? 's' : ''}. Remember to save.
          </div>
        )}

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />)}</div>
        ) : (
          grouped.map(({ key: catKey, label, items }) => items.length === 0 ? null : (
            <div key={catKey}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">{label}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((s) => (
                  <Field
                    key={s.key}
                    label={s.label ?? s.key}
                    value={getValue(s)}
                    onChange={(v) => setEdited((e) => ({ ...e, [s.key]: v }))}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
