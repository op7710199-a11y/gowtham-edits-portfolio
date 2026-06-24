import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminTable } from '../../hooks/data';
import { useActivityLog } from '../../hooks/data';
import { Modal, ConfirmDialog, InquiryStatusBadge, PageHeader } from '../../components/admin/AdminUI';
import type { Inquiry, InquiryStatus } from '../../types/database';

const STATUS_OPTIONS: InquiryStatus[] = ['new', 'contacted', 'in_progress', 'converted', 'closed'];

type InquiryRow = Inquiry;

export function InquiriesManager() {
  const { rows, loading, error, update, refetch } = useAdminTable<InquiryRow>('inquiries');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [viewTarget, setViewTarget] = useState<InquiryRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const log = useActivityLog();

  const filtered = statusFilter === 'all' ? rows : rows.filter((r) => r.status === statusFilter);
  const counts: Record<string, number> = {};
  rows.forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });

  const updateStatus = async (id: string, status: InquiryStatus, noteText?: string) => {
    try {
      await update(id, { status, notes: noteText ?? null });
      try { await log('update', 'inquiry', id, { status }); } catch { /* non-critical */ }
      if (viewTarget?.id === id) setViewTarget((v) => v ? { ...v, status } : v);
    } catch { /* handled by hook */ }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const { error: err } = await supabase.from('inquiries').delete().eq('id', id);
      if (err) throw err;
      try { await log('delete', 'inquiry', id); } catch { /* non-critical */ }
      await refetch();
    } catch { /* handled by hook */ }
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader title="Inquiries" subtitle="Manage contact form submissions and leads." />
      <div className="p-6">
        {error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        <div className="mb-4 flex flex-wrap gap-2">
          {(['all', ...STATUS_OPTIONS] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === s ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-stone-400 hover:border-gold-500/30 hover:text-white'
              }`}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${statusFilter === s ? 'bg-ink-950/30' : 'bg-white/10'}`}>
                {s === 'all' ? rows.length : (counts[s] ?? 0)}
              </span>
            </button>
          ))}
        </div>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-stone-400">No inquiries yet. When visitors submit the contact form, they'll appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-xs uppercase tracking-wider text-stone-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{r.name}</td>
                    <td className="px-4 py-3 text-stone-400">{r.email}</td>
                    <td className="px-4 py-3 text-stone-400">{r.service ?? '—'}</td>
                    <td className="px-4 py-3"><InquiryStatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-stone-500">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setViewTarget(r)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-300 hover:border-gold-500/30">View</button>
                      <button onClick={() => setConfirmDelete(r.id)} className="ml-2 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:border-red-500/40">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {viewTarget && (
        <Modal title="Inquiry Details" onClose={() => setViewTarget(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-stone-500">Name:</span> <span className="text-white">{viewTarget.name}</span></div>
              <div><span className="text-stone-500">Email:</span> <span className="text-white">{viewTarget.email}</span></div>
              <div><span className="text-stone-500">Phone:</span> <span className="text-white">{viewTarget.phone ?? '—'}</span></div>
              <div><span className="text-stone-500">Service:</span> <span className="text-white">{viewTarget.service ?? '—'}</span></div>
              <div><span className="text-stone-500">Project Type:</span> <span className="text-white">{viewTarget.project_type ?? '—'}</span></div>
              <div><span className="text-stone-500">Budget:</span> <span className="text-white">{viewTarget.budget_range ?? '—'}</span></div>
              <div><span className="text-stone-500">Deadline:</span> <span className="text-white">{viewTarget.delivery_deadline ?? '—'}</span></div>
              <div><span className="text-stone-500">Source:</span> <span className="text-white">{viewTarget.source ?? 'website'}</span></div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Message</p>
              <p className="mt-2 text-sm text-stone-300">{viewTarget.message}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Update Status</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} onClick={() => updateStatus(viewTarget.id, s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      viewTarget.status === s ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-stone-400 hover:border-gold-500/30 hover:text-white'
                    }`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Add Note</p>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100"
                placeholder="Add an internal note..." />
              <button onClick={() => { if (noteText.trim()) { updateStatus(viewTarget.id, viewTarget.status, noteText.trim()); setNoteText(''); } }}
                className="mt-2 btn-ghost px-4 py-2 text-xs">Save Note</button>
            </div>
          </div>
        </Modal>
      )}
      {confirmDelete && (
        <ConfirmDialog title="Delete Inquiry" message="Are you sure you want to delete this inquiry? This cannot be undone."
          onConfirm={() => deleteInquiry(confirmDelete)} onCancel={() => setConfirmDelete(null)} />
      )}
    </div>
  );
}
