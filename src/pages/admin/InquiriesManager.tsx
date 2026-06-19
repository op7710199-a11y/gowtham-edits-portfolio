import { useState } from 'react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, InquiryStatusBadge, PageHeader } from '../../components/admin/AdminUI';
import type { Inquiry, InquiryStatus } from '../../types/database';
import { supabase } from '../../lib/supabase';

const STATUS_OPTIONS: InquiryStatus[] = ['new', 'contacted', 'converted', 'closed'];

export function InquiriesManager() {
  const { rows, loading, error, refetch } = useAdminTable<Inquiry>('inquiries');
  const log = useActivityLog();
  const [viewTarget, setViewTarget] = useState<Inquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const filtered = statusFilter === 'all' ? rows : rows.filter((r) => r.status === statusFilter);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    setUpdatingStatus(true);
    try {
      await supabase.from('inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      await log('update', 'inquiry', id, { status });
      await refetch();
      if (viewTarget?.id === id) setViewTarget((v) => v ? { ...v, status } : v);
    } finally {
      setUpdatingStatus(false);
    }
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

  return (
    <div>
      <PageHeader title="Inquiries" subtitle="Track and respond to client inquiries submitted via the contact form." />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['all', ...STATUS_OPTIONS] as const).map((s) => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                statusFilter === s ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-stone-400 hover:border-gold-500/30 hover:text-white'
              }`}>{s === 'all' ? 'All' : s}</button>
          ))}
        </div>

        <DataTable<Inquiry>
          loading={loading} error={error} rows={filtered} searchKeys={['name', 'email', 'service', 'message']}
          onEdit={(r) => setViewTarget(r)} onDelete={(r) => setDeleteTarget(r)}
          emptyMessage="No inquiries found."
          columns={[
            { key: 'name', label: 'Name', sortable: true, render: (r) => (<div><div className="text-sm font-medium text-white">{r.name}</div><div className="text-xs text-stone-400">{r.email}</div></div>) },
            { key: 'service', label: 'Service', render: (r) => <span className="text-xs text-stone-300">{r.service ?? '—'}</span> },
            { key: 'status', label: 'Status', render: (r) => <InquiryStatusBadge status={r.status} /> },
            { key: 'created_at', label: 'Received', sortable: true, render: (r) => <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString()}</span> },
          ]}
        />
      </div>

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Inquiry Details">
        {viewTarget && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InfoItem label="Name" value={viewTarget.name} />
              <InfoItem label="Email" value={viewTarget.email} />
              <InfoItem label="Phone" value={viewTarget.phone ?? '—'} />
              <InfoItem label="Service" value={viewTarget.service ?? '—'} />
              <InfoItem label="Received" value={new Date(viewTarget.created_at).toLocaleString()} />
            </div>
            <div><div className="mb-1 text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Message</div><div className="rounded-xl border border-white/[0.06] bg-ink-900/50 p-4 text-sm leading-relaxed text-stone-200">{viewTarget.message}</div></div>
            <div><div className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Status</div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => updateStatus(viewTarget.id, s)} disabled={updatingStatus}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all disabled:opacity-50 ${
                      viewTarget.status === s ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-stone-400 hover:border-gold-500/30 hover:text-white'
                    }`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <a href={`https://wa.me/91?text=Hi ${viewTarget.name}`} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 py-2.5 text-center">WhatsApp</a>
              <a href={`mailto:${viewTarget.email}?subject=Re: Your Inquiry&body=Hi ${viewTarget.name},`} className="btn-primary flex-1 py-2.5 text-center">Reply by Email</a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} title="Delete inquiry?" description="This inquiry will be permanently deleted." />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-ink-900/40 p-3">
      <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone-500">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-white">{value}</div>
    </div>
  );
}
