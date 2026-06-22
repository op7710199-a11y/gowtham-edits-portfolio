import { useRef, useState } from 'react';
import { Upload, RefreshCw, Save, Eye, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { PageHeader } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { useLogo } from '../../hooks/useLogo';
import { useActivityLog } from '../../hooks/data';

export function LogoManager() {
  const { logoUrl, setLogoUrl } = useLogo();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const log = useActivityLog();

  const currentUrl = previewUrl ?? logoUrl;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }
    setError(null);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('logos').getPublicUrl(fileName);
      setPreviewUrl(pub.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!previewUrl) { setError('Upload a logo first.'); return; }
    setSaving(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('site_settings')
        .update({ value: JSON.stringify(previewUrl), updated_at: new Date().toISOString() })
        .eq('key', 'logo_url');
      if (err) throw err;
      setLogoUrl(previewUrl);
      setPreviewUrl(null);
      await log('update', 'site_settings', undefined, { key: 'logo_url' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Logo Manager"
        subtitle="Upload, replace, and preview the brand logo shown across the entire site."
        action={
          <button type="button" onClick={handleSave} disabled={saving || !previewUrl} className="btn-primary py-2.5 disabled:opacity-50">
            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Logo</>}
          </button>
        }
      />
      <div className="p-6 space-y-8">
        {saved && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">Logo updated. Changes are live across the site.</div>}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        <div className="card-glass p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Current Logo</h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-32 w-64 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-ink-950 p-4">
              {currentUrl ? (
                <img src={currentUrl} alt="Current logo" className="max-h-full max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-600">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs">No logo uploaded</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-ghost py-2.5 disabled:opacity-50">
                {uploading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload New Logo</>}
              </button>
              <p className="text-xs text-stone-500">PNG, JPG, SVG, or WebP. Max 5MB. Recommended height: 48–64px on dark background.</p>
              {previewUrl && (
                <p className="text-xs text-amber-300">New logo uploaded — click "Save Logo" to publish.</p>
              )}
            </div>
          </div>
        </div>
        <div className="card-glass p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Preview Locations</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Navbar', 'Login Page', 'Admin Sidebar'].map((loc) => (
              <div key={loc} className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-ink-950 p-4">
                <div className="flex h-16 items-center">
                  {currentUrl ? (
                    <img src={currentUrl} alt={`Logo in ${loc}`} className="max-h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="font-display text-lg font-extrabold text-white">Gowtham<span className="text-gold-400">edits</span></span>
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500">{loc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-gold-300 hover:text-gold-100 transition-colors">
            <Eye className="h-4 w-4" /> View live site
          </a>
        </div>
      </div>
    </div>
  );
}
