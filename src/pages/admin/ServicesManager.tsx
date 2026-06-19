import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { Field, Toggle } from './PortfolioManager';
import type { Service } from '../../types/database';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../data/content';

const ICONS: IconName[] = ['Film', 'Heart', 'Sun', 'Bike', 'Smartphone', 'Youtube', 'Palette', 'Sparkles', 'Wand2'];

const EMPTY: Partial<Service> = {
  title: '', description: '', icon: 'Film', features: [],
  ideal_for: '', delivery_time: '', display_order: 0, is_published: true,
};

export function ServicesManager() {
  const { rows, loading, error, create, update, remove } = useAdminTable<Service>('services');
  const log = useActivityLog();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<Partial<Service>>(EMPTY);
  const [featuresText, setFeaturesText] = useState('');

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFeaturesText(''); setFormError(''); setFormOpen(true); };
  const openEdit = (row: Service) => {
    setEditing(row); setForm(row);
    setFeaturesText((row.features ?? []).join('\n'));
    setFormError(''); setFormOpen(true);
  };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async () => {
    if (!form.title?.trim()) { setFormError('Title is required.'); return; }
    setSaving(true); setFormError('');
    try {
      const features = featuresText.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload = { ...form, features };
      if (editing) {
        await update(editing.id, payload);
        await log('update', 'service', editing.id, { title: form.title });
      } else {
        const created = await create(payload);
        await log('create', 'service', created.id, { title: form.title });
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
    try { await remove(deleteTarget.id); await log('delete', 'service', deleteTarget.id); setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  const togglePublish = async (row: Service) => {
    await update(row.id, { is_published: !row.is_published });
  };

  return (
    <div>
      <PageHeader title="Services" subtitle="Manage the 9 editing services shown on the public site."
        action={<button type="button" onClick={openCreate} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Add Service</button>}
      />
      <div className="p-6">
        <DataTable<Service>
          loading={loading} error={error} rows={rows} searchKeys={['title', 'description']}
          onEdit={openEdit} onDelete={(r) => setDeleteTarget(r)} onTogglePublish={togglePublish}
          emptyMessage="No services yet."
          columns={[
            { key: 'icon', label: 'Icon', width: '56px', render: (r) => <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><Icon name={(r.icon ?? 'Film') as IconName} className="h-5 w-5" /></span> },
            { key: 'title', label: 'Service', sortable: true, render: (r) => <span className="text-sm font-medium text-white">{r.title}</span> },
            { key: 'delivery_time', label: 'Delivery', render: (r) => <span className="text-xs text-stone-400">{r.delivery_time}</span> },
            { key: 'display_order', label: 'Order', render: (r) => <span className="text-xs text-stone-400">{r.display_order}</span> },
            { key: 'is_published', label: 'Status', render: (r) => <StatusBadge value={r.is_published} /> },
          ]}
        />
      </div>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit Service' : 'Add Service'}>
        <div className="space-y-4">
          <Field label="Title *" value={form.title ?? ''} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          <Field label="Description" value={form.description ?? ''} onChange={(v) => setForm((f) => ({ ...f, description: v }))} multiline />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button key={ic} type="button" onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                  className={`grid h-10 w-10 place-items-center rounded-xl border transition-all ${form.icon === ic ? 'border-gold-400 bg-gold-500/15 text-gold-200' : 'border-white/10 bg-ink-900/60 text-stone-400 hover:border-gold-500/30'}`}>
                  <Icon name={ic} className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Features (one per line)</label>
            <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4} placeholder="Full ceremony film\nHighlight trailer\nColor grade" className="w-full resize-none rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ideal For" value={form.ideal_for ?? ''} onChange={(v) => setForm((f) => ({ ...f, ideal_for: v }))} />
            <Field label="Delivery Time" value={form.delivery_time ?? ''} onChange={(v) => setForm((f) => ({ ...f, delivery_time: v }))} placeholder="7–10 days" />
          </div>
          <Field label="Display Order" type="number" value={String(form.display_order ?? 0)} onChange={(v) => setForm((f) => ({ ...f, display_order: parseInt(v) || 0 }))} />
          <Toggle label="Published" checked={!!form.is_published} onChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeForm} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Service')}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} title="Delete service?" description={`"${deleteTarget?.title}" will be removed from the website.`} />
    </div>
  );
}
