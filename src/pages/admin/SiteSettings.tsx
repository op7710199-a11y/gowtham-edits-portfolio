import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/admin/AdminUI';
import { Field } from './PortfolioManager';
import { Save, RefreshCw } from 'lucide-react';
import { useActivityLog } from '../../hooks/data';
import type { SiteSetting } from '../../types/database';

const CATEGORIES = ['branding', 'social', 'contact', 'stats'];

export function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const log = useActivityLog();

  useEffect(() => {
    supabase.from('site_settings').select('*').order('category').then(({ data }) => {
      setSettings((data ?? []) as SiteSetting[]);
      setLoading(false);
    });
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
        try {
          const orig = setting.value;
          if (typeof orig === 'number') value = Number(rawVal);
          else if (typeof orig === 'boolean') value = rawVal === 'true';
          else value = rawVal;
        } catch { value = rawVal; }
        await supabase.from('site_settings').update({ value: value as never, updated_at: new Date().toISOString() }).eq('key', key);
      }
      await log('update', 'site_settings', undefined, { keys: Object.keys(edited) });
      setSaved(true);
      setEdited({});
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: settings.filter((s) => s.category === cat),
  }));

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="Manage brand details, contact info, and stats used across the website."
        action={<button type="button" onClick={saveAll} disabled={saving || Object.keys(edited).length === 0} className="btn-primary py-2.5 disabled:opacity-50">{saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}</button>}
      />
      <div className="p-6 space-y-8">
        {saved && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Settings saved successfully.</div>}
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" />)}</div>
        ) : (
          grouped.map(({ cat, items }) => items.length === 0 ? null : (
            <div key={cat}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-gold-400">{cat}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((s) => (
                  <Field key={s.key} label={s.label ?? s.key} value={getValue(s)} onChange={(v) => setEdited((e) => ({ ...e, [s.key]: v }))} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
