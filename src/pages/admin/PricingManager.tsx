import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { Field, Toggle } from './PortfolioManager';
import type { PricingTier } from '../../types/database';

const EMPTY: Partial<PricingTier> = {
  name: '', price_label: '', period: 'per project', description: '',
  features: [], delivery_note: '', is_popular: false, display_order: 0, is_published: true,
};

export function PricingManager() {
  const { rows, loading, error, create, update, remove } = useAdminTable<PricingTier>('pricing_tiers');
  const log = useActivityLog();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PricingTier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PricingTier | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<Partial<PricingTier>>(EMPTY);
  const [featuresText, setFeaturesText] = useState('');

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFeaturesText(''); setFormError(''); setFormOpen(true); };
  const openEdit = (row: PricingTier) => {
    setEditing(row); setForm(row);
    setFeaturesText((row.features ?? []).join('\n'));
    setFormError(''); setFormOpen(true);
  };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async () => {
    if (!form.name?.trim() || !form.price_label?.trim()) { setFormError('Name and price are required.'); return; }
    setSaving(true); setFormError('');
    try {
      const features = featuresText.split('\n').map((s) => s.trim()).filter(Boolean);
      const payload = { ...form, features };
      if (editing) {
        await update(editing.id, payload);
        await log('update', 'pricing', editing.id, { name: form.name });
      } else {
        const created = await create(payload);
        await log('create', 'pricing', created.id, { name: form.name });
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
    try { await remove(deleteTarget.id); await log('delete', 'pricing', deleteTarget.id); setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <PageHeader title="Pricing" subtitle="Edit pricing packages shown on the public site."
        action={<button type="button" onClick={openCreate} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Add Package</button>}
      />
      <div className="p-6">
        <DataTable<PricingTier>
          loading={loading} error={error} rows={rows} searchKeys={['name']}
          onEdit={openEdit} onDelete={(r) => setDeleteTarget(r)}
          emptyMessage="No pricing tiers yet."
          columns={[
            { key: 'name', label: 'Package', sortable: true, render: (r) => <span className="text-sm font-bold text-white">{r.name}</span> },
            { key: 'price_label', label: 'Price', render: (r) => <span className="font-display text-lg font-bold text-gradient-gold">{r.price_label}</span> },
            { key: 'period', label: 'Period', render: (r) => <span className="text-xs text-stone-400">/ {r.period}</span> },
            { key: 'is_popular', label: 'Popular', render: (r) => <StatusBadge value={r.is_popular} trueLabel="Popular" falseLabel="—" /> },
            { key: 'is_published', label: 'Status', render: (r) => <StatusBadge value={r.is_published} /> },
          ]}
        />
      </div>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit Package' : 'Add Package'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Package Name *" value={form.name ?? ''} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Premium" />
            <Field label="Price *" value={form.price_label ?? ''} onChange={(v) => setForm((f) => ({ ...f, price_label: v }))} placeholder="₹14,999" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Period" value={form.period ?? ''} onChange={(v) => setForm((f) => ({ ...f, period: v }))} placeholder="per project" />
            <Field label="Delivery Note" value={form.delivery_note ?? ''} onChange={(v) => setForm((f) => ({ ...f, delivery_note: v }))} placeholder="4K MP4 + vertical reel" />
          </div>
          <Field label="Description" value={form.description ?? ''} onChange={(v) => setForm((f) => ({ ...f, description: v }))} multiline />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Features (one per line)</label>
            <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={5} placeholder="Full highlight film\nCinematic color grade\n5 revisions" className="w-full resize-none rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none" />
          </div>
          <Field label="Display Order" type="number" value={String(form.display_order ?? 0)} onChange={(v) => setForm((f) => ({ ...f, display_order: parseInt(v) || 0 }))} />
          <div className="flex items-center gap-6">
            <Toggle label="Mark as Popular" checked={!!form.is_popular} onChange={(v) => setForm((f) => ({ ...f, is_popular: v }))} />
            <Toggle label="Published" checked={!!form.is_published} onChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
          </div>
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeForm} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Package')}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} title="Delete pricing package?" description={`"${deleteTarget?.name}" will be permanently removed.`} />
    </div>
  );
}
