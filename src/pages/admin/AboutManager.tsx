import { useRef, useState } from 'react';
import { Save, RefreshCw, Eye, Upload, Instagram, Plus, X, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/admin/AdminUI';
import { Field, Toggle } from './PortfolioManager';
import { useAboutAdmin } from '../../hooks/useAboutSettings';

export function AboutManager() {
  const { form, setForm, loading, saving, saved, error, uploading, uploadImage, save } = useAboutAdmin();
  const [skillInput, setSkillInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setValidationError('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setValidationError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setValidationError('Image must be under 5MB.'); return; }
    setValidationError('');
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, profile_image_url: url }));
    } catch (e) {
      setValidationError(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      update('skills', [...form.skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    update('skills', form.skills.filter((x) => x !== s));
  };

  const handleSave = () => {
    if (!form.name.trim()) { setValidationError('Name is required.'); return; }
    if (!form.title.trim()) { setValidationError('Title is required.'); return; }
    if (!form.bio.trim()) { setValidationError('Bio is required.'); return; }
    save();
  };

  return (
    <div>
      <PageHeader
        title="About Manager"
        subtitle="Update the profile image, bio, skills, quote, Instagram link, and CTA text shown in the About section."
        action={
          <button type="button" onClick={handleSave} disabled={saving || loading} className="btn-primary py-2.5 disabled:opacity-50">
            {saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        }
      />
      <div className="p-6 space-y-8">
        {saved && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">About section saved successfully. Changes are live.</div>}
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {validationError && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" /> {validationError}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />)}</div>
        ) : (
          <>
            {/* Profile Image Upload */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Profile Image</h2>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative h-32 w-32 shrink-0">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-gold-500/30 bg-ink-900">
                    {form.profile_image_url ? (
                      <img src={form.profile_image_url} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-600">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  {form.profile_image_url && (
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-ink-950 bg-green-500" title="Image set" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="btn-ghost py-2.5 disabled:opacity-50">
                    {uploading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload Image</>}
                  </button>
                  {form.profile_image_url && (
                    <button type="button" onClick={() => update('profile_image_url', '')}
                      className="ml-2 text-xs text-stone-500 hover:text-red-300">Remove</button>
                  )}
                  <p className="text-xs text-stone-500">JPG, PNG, WebP. Max 5MB. Stored in Supabase Storage.</p>
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Identity</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name *" value={form.name} onChange={(v) => update('name', v)} placeholder="Gowtham" />
                <Field label="Title *" value={form.title} onChange={(v) => update('title', v)} placeholder="Cinematic Video Editor" />
              </div>
            </div>

            {/* Bio */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Bio</h2>
              <Field label="Bio *" value={form.bio} onChange={(v) => update('bio', v)} multiline />
            </div>

            {/* Skills */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 rounded-full border border-gold-500/20 bg-gold-500/[0.05] px-3 py-1.5 text-xs font-medium text-gold-100">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="text-gold-400 hover:text-red-300">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {form.skills.length === 0 && <p className="text-xs text-stone-500">No skills added yet.</p>}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="Add a skill and press Enter"
                  className="flex-1 rounded-xl border border-white/10 bg-ink-900/60 px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none"
                />
                <button type="button" onClick={addSkill} className="btn-primary px-4 py-2.5">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quote */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Quote</h2>
              <Field label="Quote Text" value={form.quote} onChange={(v) => update('quote', v)} multiline placeholder="Every frame tells a story..." />
              <Field label="Quote Author" value={form.quote_author} onChange={(v) => update('quote_author', v)} placeholder="Gowtham" />
            </div>

            {/* Social & CTA */}
            <div className="card-glass p-6 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">Social & CTA</h2>
              <div className="relative">
                <Instagram className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400" />
                <input
                  type="url"
                  value={form.instagram_url}
                  onChange={(e) => update('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/gowtham.edits"
                  className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-11 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              <Field label="CTA Button Text" value={form.cta_text} onChange={(v) => update('cta_text', v)} placeholder="Let's Work Together" />
              <Toggle label="Published" checked={form.is_published} onChange={(v) => update('is_published', v)} />
            </div>

            {/* Preview link */}
            <div className="flex justify-end">
              <a href="/#about" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold-300 hover:text-gold-100 transition-colors">
                <Eye className="h-4 w-4" /> Preview live About section
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
