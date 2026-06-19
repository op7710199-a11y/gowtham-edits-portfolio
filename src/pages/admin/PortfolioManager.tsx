import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import type { PortfolioItem } from '../../types/database';

const CATEGORIES = ['Wedding', 'Haldi', 'Pre-Wedding', 'Bike Shoots', 'Reels', 'Cinematic Edits', 'Social Media Content'];

const EMPTY: Partial<PortfolioItem> = {
  title: '', category: 'Wedding', description: '', thumbnail_url: '',
  video_url: '', tags: [], is_featured: false, is_published: true, display_order: 0,
};

export function PortfolioManager() {
  const { rows, loading, error, create, update, remove } = useAdminTable<PortfolioItem>('portfolio_items');
  const log = useActivityLog();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<Partial<PortfolioItem>>(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(''); setFormOpen(true); };
  const openEdit = (row: PortfolioItem) => { setEditing(row); setForm(row); setFormError(''); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async () => {
    if (!form.title?.trim() || !form.category) { setFormError('Title and category are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) {
        await update(editing.id, form);
        await log('update', 'portfolio', editing.id, { title: form.title });
      } else {
        const created = await create(form);
        await log('create', 'portfolio', created.id, { title: form.title });
      }
      closeForm();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      await log('delete', 'portfolio', deleteTarget.id, { title: deleteTarget.title });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (row: PortfolioItem) => {
    await update(row.id, { is_published: !row.is_published });
    await log('update', 'portfolio', row.id, { is_published: !row.is_published });
  };

  return (
    <div>
      <PageHeader title="Portfolio" subtitle="Manage all portfolio items — create, edit, publish, delete."
        action={<button type="button" onClick={openCreate} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Add Item</button>}
      />
      <div className="p-6">
        <DataTable<PortfolioItem>
          loading={loading} error={error} rows={rows} searchKeys={['title', 'category']}
          onEdit={openEdit} onDelete={(r) => setDeleteTarget(r)} onTogglePublish={togglePublish}
          emptyMessage="No portfolio items yet. Add your first project."
          columns={[
            { key: 'thumbnail_url', label: 'Image', width: '72px', render: (r) => r.thumbnail_url ? <img src={r.thumbnail_url} alt={r.title} className="h-12 w-16 rounded-lg object-cover" loading="lazy" /> : <div className="h-12 w-16 rounded-lg bg-ink-800" /> },
            { key: 'title', label: 'Title', sortable: true, render: (r) => <span className="text-sm font-medium text-white">{r.title}</span> },
            { key: 'category', label: 'Category', sortable: true, render: (r) => <span className="text-xs text-stone-300">{r.category}</span> },
            { key: 'is_featured', label: 'Featured', render: (r) => <StatusBadge value={r.is_featured} trueLabel="Featured" falseLabel="—" /> },
            { key: 'is_published', label: 'Status', render: (r) => <StatusBadge value={r.is_published} /> },
            { key: 'display_order', label: 'Order', render: (r) => <span className="text-xs text-stone-400">{r.display_order}</span> },
          ]}
        />
      </div>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}>
        <div className="space-y-4">
          <Field label="Title *" value={form.title ?? ''} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Category *</label>
            <select value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="admin-select">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="Description" value={form.description ?? ''} onChange={(v) => setForm((f) => ({ ...f, description: v }))} multiline />
          <Field label="Thumbnail URL" value={form.thumbnail_url ?? ''} onChange={(v) => setForm((f) => ({ ...f, thumbnail_url: v }))} placeholder="https://..." />
          {form.thumbnail_url && (<img src={form.thumbnail_url} alt="Preview" className="h-24 w-full rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />)}
          <Field label="Video URL (optional)" value={form.video_url ?? ''} onChange={(v) => setForm((f) => ({ ...f, video_url: v }))} placeholder="https://..." />
          <Field label="Display Order" type="number" value={String(form.display_order ?? 0)} onChange={(v) => setForm((f) => ({ ...f, display_order: parseInt(v) || 0 }))} />
          <div className="flex items-center gap-6">
            <Toggle label="Featured" checked={!!form.is_featured} onChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} />
            <Toggle label="Published" checked={!!form.is_published} onChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
          </div>
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeForm} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Item')}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} title="Delete portfolio item?" description={`"${deleteTarget?.title}" will be permanently removed from the portfolio.`} />
    </div>
  );
}

export function Field({
  label, value, onChange, placeholder, type = 'text', multiline = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; multiline?: boolean;
}) {
  const base = "w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${base} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />
      )}
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-300">
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-gold-500' : 'bg-ink-700'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
      {label}
    </label>
  );
}
