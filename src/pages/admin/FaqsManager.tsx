import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { Field, Toggle } from './PortfolioManager';
import type { FaqItem } from '../../types/database';

const EMPTY: Partial<FaqItem> = { question: '', answer: '', display_order: 0, is_published: true };

export function FaqsManager() {
  const { rows, loading, error, create, update, remove } = useAdminTable<FaqItem>('faqs');
  const log = useActivityLog();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<Partial<FaqItem>>(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(''); setFormOpen(true); };
  const openEdit = (row: FaqItem) => { setEditing(row); setForm(row); setFormError(''); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = async () => {
    if (!form.question?.trim() || !form.answer?.trim()) { setFormError('Both question and answer are required.'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) {
        await update(editing.id, form);
        await log('update', 'faq', editing.id);
      } else {
        const created = await create(form);
        await log('create', 'faq', created.id);
      }
      closeForm();
    } catch (e) { setFormError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await remove(deleteTarget.id); await log('delete', 'faq', deleteTarget.id); setDeleteTarget(null); }
    finally { setDeleting(false); }
  };

  const togglePublish = async (row: FaqItem) => {
    await update(row.id, { is_published: !row.is_published });
  };

  return (
    <div>
      <PageHeader title="FAQs" subtitle="Manage the frequently asked questions shown on the public site."
        action={<button type="button" onClick={openCreate} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Add FAQ</button>}
      />
      <div className="p-6">
        <DataTable<FaqItem>
          loading={loading} error={error} rows={rows} searchKeys={['question', 'answer']}
          onEdit={openEdit} onDelete={(r) => setDeleteTarget(r)} onTogglePublish={togglePublish}
          emptyMessage="No FAQs yet."
          columns={[
            { key: 'question', label: 'Question', sortable: true, render: (r) => <span className="text-sm font-medium text-white">{r.question}</span> },
            { key: 'answer', label: 'Answer', render: (r) => <span className="line-clamp-2 text-xs text-stone-300">{r.answer}</span> },
            { key: 'display_order', label: 'Order', render: (r) => <span className="text-xs text-stone-400">{r.display_order}</span> },
            { key: 'is_published', label: 'Status', render: (r) => <StatusBadge value={r.is_published} /> },
          ]}
        />
      </div>

      <Modal open={formOpen} onClose={closeForm} title={editing ? 'Edit FAQ' : 'Add FAQ'}>
        <div className="space-y-4">
          <Field label="Question *" value={form.question ?? ''} onChange={(v) => setForm((f) => ({ ...f, question: v }))} />
          <Field label="Answer *" value={form.answer ?? ''} onChange={(v) => setForm((f) => ({ ...f, answer: v }))} multiline />
          <Field label="Display Order" type="number" value={String(form.display_order ?? 0)} onChange={(v) => setForm((f) => ({ ...f, display_order: parseInt(v) || 0 }))} />
          <Toggle label="Published" checked={!!form.is_published} onChange={(v) => setForm((f) => ({ ...f, is_published: v }))} />
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeForm} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={save} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : (editing ? 'Save' : 'Add FAQ')}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} title="Delete FAQ?" description="This question will be removed from the site." />
    </div>
  );
}
