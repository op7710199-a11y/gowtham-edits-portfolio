import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/admin/AdminUI';
import { Save, RefreshCw } from 'lucide-react';
import { useActivityLog } from '../../hooks/data';
import type { SiteSetting } from '../../types/database';

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
        const { data, error: err } = await supabase
          .from('site_settings')
          .select('*')
          .order('category')
          .order('label');
        
        if (!active) return;
        if (err) {
          setError('Failed to load settings: ' + err.message);
          setLoading(false);
          return;
        }
        
        console.log("Raw Database Settings:", data);
        setSettings((data ?? []) as SiteSetting[]);
        setLoading(false);
      } catch (e) {
        if (!active) return;
        setError('Failed to load settings.');
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const getValue = (s: SiteSetting) => {
    if (s.key in edited) return edited[s.key];
    return typeof s.value === 'string' ? s.value : String(s.value);
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
          .update({ value: value, updated_at: new Date().toISOString() })
          .eq('key', key);
          
        if (updErr) throw new Error(`Failed to save "${key}": ${updErr.message}`);
      }
      try { await log('update', 'site_settings', undefined, { keys: Object.keys(edited) }); } catch {}
      setSaved(true);
      setEdited({});
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally { setSaving(false); }
  };

  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="System-wide site configurations."
        action={
          <button type="button" onClick={saveAll} disabled={saving || !hasChanges} className="btn-primary py-2.5 disabled:opacity-50">
            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving…</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        }
      />
      <div className="p-6 space-y-8">
        {saved && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Settings saved successfully.</div>}
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/[0.04]" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {settings.map((s) => (
              <div key={s.key} className="p-4 border border-white/10 rounded-lg bg-white/[0.02]">
                <label className="block mb-2 text-gold-400 font-bold text-xs uppercase tracking-wider">
                  {s.category} — {s.label}
                </label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-black p-3 text-white focus:border-gold-500 focus:outline-none"
                  value={getValue(s)}
                  onChange={(e) => setEdited((prev) => ({ ...prev, [s.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
                          }
