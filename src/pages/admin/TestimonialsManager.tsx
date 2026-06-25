import { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { Field, Toggle } from './PortfolioManager';
import type { Testimonial } from '../../types/database';

const EMPTY: Partial<Testimonial> = {
  client_name: '', client_role: '', avatar_url: '', rating: 5, content: '',
  display_order: 0, is_published: true,
};

export function TestimonialsManager() {
  const { rows, loading, error, create, update, remove } = useAdminTable<Testimonial>('testimonials');
  const log = useActivityLog();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<Partial<Testimonial>>(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(''); setFormOpen(true); };
  const openEdit = (row: Testimonial) => { setEditing(row); setForm(row); setFormError(''); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async () => {
    if (!form.client_name?.trim() || !form.content?.trim()) { setFormError('Client name and review are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) {
        await update(editing.id, form);
        await log('update', 'testimonial', editing.id);
      } else {
        const created = await create(form);
        await log('create', 'testimonial', created.id);
      }
      closeForm();
    } catch (e) { setFormError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await remove(deleteTarget.id); await log('delete', 'testimonial', deleteTarget.id); setDeleteTarget(null); }
    catch (e) { console.error('TestimonialsManager delete error:', e); setFormError(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setDeleting(false); }
  };

  const togglePublish = async (row: Testimonial) => {
    try { await update(row.id, { is_published: !row.is_published }); }
    catch (e) { console.error('TestimonialsManager togglePublish error:', e); setFormError(e instanceof Error ? e.message : 'Publish toggle failed'); }
  };

  return (
    <div>
      <PageHeader title="Testimonials" subtitle="Manage client reviews shown on the public site."
        action={<button type="button" onClick={openCreate} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Add Review</button>}
      />
      <div className="p-6">
        <DataTable<Testimonial>
          loading={loading} error={error} rows={rows} searchKeys={['client_name', 'content']}
          onEdit={openEdit} onDelete={(r) => setDeleteTarget(r)} onTogglePublish={togglePublish}
          emptyMessage="No testimonials yet."
          columns={[
            { key: 'avatar_url', label: 'Avatar', width: '56px', render: (r) => r.avatar_url ? <img src={r.avatar_url} alt={r.client_name ?? ''} className="h-10 w-10 rounded-full object-cover" loading="lazy" /> : <div className="h-10 w-10 rounded-full bg-ink-800 grid place-items-center text-xs text-stone-400">{(r.client_name ?? '?')[0] ?? '?'}</div> },
            { key: 'client_name', label: 'Client', sortable: true, render: (r) => (<div><div className="text-sm font-medium text-white">{r.client_name}</div><div className="text-xs text-stone-400">{r.client_role}</div></div>) },
            { key: 'rating', label: 'Rating', render: (r) => (<div className="flex gap-0.5 text-gold-400">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />)}</div>) },
            { key: 'content', label: 'Review', render: (r) => <span className="line-clamp-2 text-xs text-stone-300">{r.content}</span> },
            { key: 'is_published', label: 'Status', render: (r) => <StatusBadge value={r.is_published} /> },
          ]}
        />
      </div>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Client Name *" value={form.client_name ?? ''} onChange={(v) => setForm((f) => ({ ...f, client_name: v }))} />
            <Field label="Client Role" value={form.client_role ?? ''} onChange={(v) => setForm((f) => ({ ...f, client_role: v }))} placeholder="Wedding • Bengaluru" />
          </div>
          <Field label="Avatar URL" value={form.avatar_url ?? ''} onChange={(v) => setForm((f) => ({ ...f, avatar_url: v }))} placeholder="https://..." />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Rating</label>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  className={`text-2xl ${(form.rating ?? 5) >= n ? 'text-gold-400' : 'text-stone-600'}`}>
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-stone-400">{form.rating}/5</span>
            </div>
          </div>
          <Field label="Review *" value={form.content ?? ''} onChange={(v) => setForm((f) => ({ ...f, content: v }))} multiline />
          <Field label="Display Order" type="number" value={String(form.display_order ?? 0)} onChange={(v) => setForm((f) => ({ ...f, display_order: parseInt(v) || 0 }))} />
          <Toggle label="Published" checked={!!form.is_published} onChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeForm} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Review')}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} title="Delete testimonial?" description={`Review from "${deleteTarget?.client_name}" will be permanently removed.`} />
    </div>
  );
}
