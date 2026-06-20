import { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { Field, Toggle } from './PortfolioManager';
import type { StatRow } from '../../hooks/useHeroSettings';

const EMPTY: Partial<StatRow> = { label: '', value: 0, suffix: '+', icon: 'Award', display_order: 0, is_published: true };

export function StatsManager() {
  const { rows, loading, error, create, update, remove } = useAdminTable<StatRow>('stats');
  const log = useActivityLog();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StatRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StatRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<Partial<StatRow>>(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(''); setFormOpen(true); };
  const openEdit = (row: StatRow) => { setEditing(row); setForm(row); setFormError(''); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async () => {
    if (!form.label?.trim()) { setFormError('Label is required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) {
        await update(editing.id, form);
        await log('update', 'stat', editing.id, { label: form.label });
      } else {
        const created = await create(form);
        await log('create', 'stat', created.id, { label: form.label });
      }
      closeForm();
    } catch (e) { setFormError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await remove(deleteTarget.id); await log('delete', 'stat', deleteTarget.id); setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  const togglePublish = async (row: StatRow) => {
    await update(row.id, { is_published: !row.is_published });
  };

  return (
    <div>
      <PageHeader title="Statistics" subtitle="Edit the numbers shown in the hero section and about page."
        action={<button type="button" onClick={openCreate} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Add Stat</button>}
      />
      <div className="p-6">
        <DataTable<StatRow>
          loading={loading} error={error} rows={rows} searchKeys={['label']}
          onEdit={openEdit} onDelete={(r) => setDeleteTarget(r)} onTogglePublish={togglePublish}
          emptyMessage="No statistics yet."
          columns={[
            { key: 'label', label: 'Label', sortable: true, render: (r) => <span className="text-sm font-medium text-white">{r.label}</span> },
            { key: 'value', label: 'Value', render: (r) => <span className="font-display text-2xl font-bold text-gradient-gold">{r.value}{r.suffix}</span> },
            { key: 'display_order', label: 'Order', render: (r) => <span className="flex items-center gap-1 text-xs text-stone-400"><GripVertical className="h-3 w-3" />{r.display_order}</span> },
            { key: 'is_published', label: 'Status', render: (r) => <StatusBadge value={r.is_published} /> },
          ]}
        />
      </div>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit Statistic' : 'Add Statistic'} maxWidth="max-w-md">
        <div className="space-y-4">
          <Field label="Label *" value={String(form.label ?? '')} onChange={(v) => setForm((f) => ({ ...f, label: v }))} placeholder="Happy Clients" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Value *" type="number" value={String(form.value ?? 0)} onChange={(v) => setForm((f) => ({ ...f, value: parseFloat(v) || 0 }))} placeholder="240" />
            <Field label="Suffix" value={String(form.suffix ?? '+')} onChange={(v) => setForm((f) => ({ ...f, suffix: v }))} placeholder="+ or %" />
          </div>
          <Field label="Display Order" type="number" value={String(form.display_order ?? 0)} onChange={(v) => setForm((f) => ({ ...f, display_order: parseInt(v) || 0 }))} />
          <Toggle label="Published" checked={!!form.is_published} onChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeForm} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting}
        title="Delete statistic?" description={`"${deleteTarget?.label}" will be removed from the site.`} />
    </div>
  );
}
