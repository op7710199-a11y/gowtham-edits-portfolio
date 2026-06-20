import { useState } from 'react';
import { Download, Mail } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, InquiryStatusBadge, PageHeader } from '../../components/admin/AdminUI';
import type { Inquiry, InquiryStatus } from '../../types/database';
import { supabase } from '../../lib/supabase';

const STATUS_OPTIONS: InquiryStatus[] = ['new', 'contacted', 'converted', 'closed'];

// Extended inquiry type with new lead fields
type FullInquiry = Inquiry & {
  whatsapp?: string;
  project_type?: string;
  budget_range?: string;
  delivery_deadline?: string;
};

export function InquiriesManager() {
  const { rows, loading, error, refetch } = useAdminTable<FullInquiry>('inquiries');
  const log = useActivityLog();
  const [viewTarget, setViewTarget] = useState<FullInquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FullInquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState('');

  const filtered = statusFilter === 'all' ? rows : rows.filter((r) => r.status === statusFilter);

  const counts: Record<string, number> = {};
  rows.forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });

  const updateStatus = async (id: string, status: InquiryStatus, noteText?: string) => {
    setUpdatingStatus(true);
    try {
      await supabase.from('inquiries').update({
        status,
        notes: noteText ?? undefined,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      await log('update', 'inquiry', id, { status });
      await refetch();
      if (viewTarget?.id === id) setViewTarget((v) => v ? { ...v, status } : v);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const saveNotes = async () => {
    if (!viewTarget) return;
    await supabase.from('inquiries').update({ notes, updated_at: new Date().toISOString() }).eq('id', viewTarget.id);
    await refetch();
    setViewTarget((v) => v ? { ...v, notes } : v);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await supabase.from('inquiries').delete().eq('id', deleteTarget.id);
      await log('delete', 'inquiry', deleteTarget.id);
      await refetch();
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  // CSV export
  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'WhatsApp', 'Project Type', 'Budget', 'Deadline', 'Message', 'Status', 'Received'];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = filtered.map((r) => [
      r.name, r.email, r.phone ?? '', r.whatsapp ?? '',
      r.project_type ?? r.service ?? '', r.budget_range ?? '',
      r.delivery_deadline ?? '', r.message ?? '',
      r.status, new Date(r.created_at).toLocaleDateString(),
    ].map(escape).join(','));
    const csv = [headers.map(escape).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inquiries-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Inquiries"
        subtitle="Track and respond to all client leads from the contact form."
        action={
          <button type="button" onClick={exportCSV} className="btn-ghost py-2.5">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />
      <div className="p-6 space-y-4">
        {/* Status filters with counts */}
        <div className="flex flex-wrap gap-2">
          {(['all', ...STATUS_OPTIONS] as const).map((s) => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                statusFilter === s ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-stone-400 hover:border-gold-500/30 hover:text-white'
              }`}>
              {s === 'all' ? 'All' : s}
              {s !== 'all' && counts[s] ? (
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${statusFilter === s ? 'bg-ink-950/30' : 'bg-white/10'}`}>
                  {counts[s]}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <DataTable<FullInquiry>
          loading={loading} error={error} rows={filtered}
          searchKeys={['name', 'email', 'service', 'project_type', 'message']}
          onEdit={(r) => { setViewTarget(r); setNotes(r.notes ?? ''); }}
          onDelete={(r) => setDeleteTarget(r)}
          emptyMessage="No inquiries found."
          columns={[
            { key: 'name', label: 'Lead', sortable: true, render: (r) => (
              <div>
                <div className="text-sm font-semibold text-white">{r.name}</div>
                <div className="text-xs text-stone-400">{r.email}</div>
              </div>
            )},
            { key: 'project_type', label: 'Project', render: (r) => <span className="text-xs text-stone-300">{r.project_type ?? r.service ?? '—'}</span> },
            { key: 'budget_range', label: 'Budget', render: (r) => <span className="text-xs text-gold-300">{r.budget_range ?? '—'}</span> },
            { key: 'status', label: 'Status', render: (r) => <InquiryStatusBadge status={r.status} /> },
            { key: 'created_at', label: 'Received', sortable: true, render: (r) => <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString()}</span> },
          ]}
        />
      </div>

      {/* View modal */}
      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Lead Details" maxWidth="max-w-2xl">
        {viewTarget && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Name', value: viewTarget.name },
                { label: 'Email', value: viewTarget.email },
                { label: 'Phone', value: viewTarget.phone ?? '—' },
                { label: 'WhatsApp', value: viewTarget.whatsapp ?? '—' },
                { label: 'Project Type', value: viewTarget.project_type ?? viewTarget.service ?? '—' },
                { label: 'Budget', value: viewTarget.budget_range ?? '—' },
                { label: 'Deadline', value: viewTarget.delivery_deadline ?? '—' },
                { label: 'Source', value: (viewTarget as FullInquiry & { source?: string }).source ?? 'website' },
                { label: 'Received', value: new Date(viewTarget.created_at).toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/[0.06] bg-ink-900/40 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500">{item.label}</div>
                  <div className="mt-0.5 text-sm font-medium text-white break-all">{item.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">Message</div>
              <div className="rounded-xl border border-white/[0.06] bg-ink-900/50 p-4 text-sm leading-relaxed text-stone-200">{viewTarget.message}</div>
            </div>

            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">Internal Notes</div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="Add notes about this lead…"
                className="w-full resize-none rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none" />
              <button type="button" onClick={saveNotes} className="mt-2 text-xs text-gold-300 hover:text-gold-100">Save notes</button>
            </div>

            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">Update Status</div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => updateStatus(viewTarget.id, s, notes)} disabled={updatingStatus}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all disabled:opacity-50 ${
                      viewTarget.status === s ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-stone-400 hover:border-gold-500/30 hover:text-white'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <a href={`https://wa.me/${viewTarget.whatsapp?.replace(/\D/g, '') || viewTarget.phone?.replace(/\D/g, '') || '91'}`}
                target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 py-2.5 text-center text-sm">
                WhatsApp
              </a>
              <a href={`mailto:${viewTarget.email}?subject=Re: Your Video Editing Inquiry&body=Hi ${viewTarget.name},%0A%0A`}
                className="btn-primary flex-1 py-2.5 text-center text-sm">
                <Mail className="h-4 w-4" /> Reply
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting}
        title="Delete inquiry?" description="This lead will be permanently deleted." />
    </div>
  );
}
