import { useRef, useState } from 'react';
import { Upload, RefreshCw, Save } from 'lucide-react';
import { PageHeader } from '../../components/admin/AdminUI';
import { supabase } from '../../lib/supabase';
import { useActivityLog } from '../../hooks/data';

type IconName = 'Film' | 'Heart' | 'Sun' | 'Bike' | 'Smartphone' | 'Youtube' | 'Palette' | 'Sparkles' | 'Wand2' | 'Users' | 'Award' | 'Clock' | 'CheckCircle' | 'MessageCircle' | 'Instagram' | 'Send' | 'ArrowUpRight';

const ICON_OPTIONS: IconName[] = ['Film', 'Heart', 'Sun', 'Bike', 'Smartphone', 'Youtube', 'Palette', 'Sparkles', 'Wand2', 'Users', 'Award', 'Clock', 'CheckCircle', 'MessageCircle', 'Instagram', 'Send', 'ArrowUpRight'];

interface FaqForm {
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
}

const EMPTY_FORM: FaqForm = {
  question: '',
  answer: '',
  display_order: 0,
  is_published: true,
};

export function FaqsManager() {
  const [faqs, setFaqs] = useState<FaqForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FaqForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const log = useActivityLog();

  const fetchFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order');
      if (err) throw err;
      setFaqs((data ?? []).map((d) => ({
        question: (d as { question?: string }).question ?? '',
        answer: (d as { answer?: string }).answer ?? '',
        display_order: (d as { display_order?: number }).display_order ?? 0,
        is_published: (d as { is_published?: boolean }).is_published ?? true,
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const saveFaq = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setFormError('Question and answer are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        const { error: err } = await supabase
          .from('faqs')
          .update(form)
          .eq('id', editing);
        if (err) throw err;
        try { await log('update', 'faq', editing); } catch { /* non-critical */ }
      } else {
        const { data, error: err } = await supabase
          .from('faqs')
          .insert(form)
          .select()
          .maybeSingle();
        if (err) throw err;
        try { await log('create', 'faq', data?.id); } catch { /* non-critical */ }
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      await fetchFaqs();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const { error: err } = await supabase.from('faqs').delete().eq('id', id);
      if (err) throw err;
      try { await log('delete', 'faq', id); } catch { /* non-critical */ }
      await fetchFaqs();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const { error: err } = await supabase
        .from('faqs')
        .update({ is_published: !current })
        .eq('id', id);
      if (err) throw err;
      await fetchFaqs();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div>
      <PageHeader
        title="FAQ Manager"
        subtitle="Manage frequently asked questions shown on the public site."
      />

      {/* Form */}
      <div className="p-6">
        <div className="card-glass p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            {editing ? 'Edit FAQ' : 'Add New FAQ'}
          </h2>
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            placeholder="Question"
            className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none"
          />
          <textarea
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            placeholder="Answer"
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none"
          />
          <input
            type="number"
            value={form.display_order}
            onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
            placeholder="Display Order"
            className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20 bg-ink-900"
            />
            Published
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setForm(EMPTY_FORM); setEditing(null); setFormError(''); }}
              className="btn-ghost flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveFaq}
              disabled={saving}
              className="btn-primary flex-1 py-2.5 disabled:opacity-60"
            >
              {saving ? 'Saving…' : editing ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-6">
        {loading && <p className="text-sm text-stone-400">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && !error && faqs.length === 0 && (
          <p className="text-sm text-stone-400">No FAQs yet. Add one above.</p>
        )}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card-glass p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                <p className="mt-1 text-sm text-stone-400">{faq.answer}</p>
                <p className="mt-2 text-xs text-stone-500">Order: {faq.display_order} · {faq.is_published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => togglePublish(faq.question, faq.is_published)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-300 hover:border-gold-500/30"
                >
                  {faq.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(faq.question); setForm(faq); }}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-300 hover:border-gold-500/30"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteFaq(faq.question)}
                  className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:border-red-500/40"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
