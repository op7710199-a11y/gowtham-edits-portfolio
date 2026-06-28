import { useEffect, useState } from 'react';
import { Download, Mail, Phone, MessageSquare, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { useAdminTable, useActivityLog } from '../../hooks/data';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, InquiryStatusBadge, PageHeader } from '../../components/admin/AdminUI';
import type { Inquiry, InquiryStatus } from '../../types/database';
import { supabase } from '../../lib/supabase';

const STATUS_OPTIONS: InquiryStatus[] = ['new', 'contacted', 'in_progress', 'converted', 'closed'];

type FullInquiry = Inquiry & {
  whatsapp?: string;
  project_type?: string;
  budget_range?: string;
  delivery_deadline?: string;
  priority?: 'low' | 'medium' | 'high';
};

export function InquiriesManager() {
  const { rows, loading, error, refetch } = useAdminTable<FullInquiry>('inquiries');
  const log = useActivityLog();
  const [viewTarget, setViewTarget] = useState<FullInquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');

  useEffect(() => {
    const channel = supabase.channel('inquiries-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => refetch())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refetch]);

  const filtered = statusFilter === 'all' ? rows : rows.filter((r) => r.status === statusFilter);
  const counts: Record<string, number> = {};
  rows.forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await supabase.from('inquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    await log('update', 'inquiry', id, { status });
    await refetch();
    if (viewTarget?.id === id) setViewTarget({ ...viewTarget, status });
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'WhatsApp', 'Project Type', 'Budget', 'Deadline', 'Message', 'Status', 'Received'];
    const escape = (v: string) => `"${(v || '').replace(/"/g, '""')}"`;
    const csvRows = filtered.map((r) => [
      r.name, r.email, r.phone ?? '', r.whatsapp ?? '',
      r.project_type ?? r.service ?? '', r.budget_range ?? '',
      r.delivery_deadline ?? '', r.message ?? '',
      r.status, new Date(r.created_at).toLocaleDateString(),
    ].map(escape).join(','));
    const csv = [headers.map(escape).join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Inquiries" subtitle="Manage and track your client pipeline." 
        action={<button onClick={exportCSV} className="btn-ghost py-2.5"><Download className="h-4 w-4" /> Export CSV</button>} 
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mb-6">
        {[{l: "Total Leads", v: rows.length}, {l: "New", v: counts.new || 0, c: "text-gold-400"}, {l: "Contacted", v: counts.contacted || 0, c: "text-blue-400"}, {l: "Converted", v: counts.converted || 0, c: "text-green-400"}].map((stat, i) => (
          <div key={i} className="p-4 bg-ink-900/50 border border-white/10 rounded-xl">
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">{stat.l}</div>
            <div className={`text-xl font-bold ${stat.c || 'text-white'}`}>{stat.v}</div>
          </div>
        ))}
      </div>

      <div className="px-6">
        <DataTable<FullInquiry>
          loading={loading} error={error} rows={filtered}
          searchKeys={['name', 'email', 'phone', 'whatsapp', 'status']}
          onEdit={(r) => setViewTarget(r)}
          columns={[
            { key: 'name', label: 'Lead', render: (r) => (
              <div><div className="text-sm font-semibold text-white">{r.name}</div><div className="text-xs text-stone-400">{r.email}</div></div>
            )},
            { key: 'priority', label: 'Priority', render: (r) => (
              r.priority === 'high' ? <ShieldAlert className="h-4 w-4 text-red-500" /> : 
              r.priority === 'low' ? <Shield className="h-4 w-4 text-stone-600" /> : <ShieldCheck className="h-4 w-4 text-blue-500" />
            )},
            { key: 'status', label: 'Status', render: (r) => <InquiryStatusBadge status={r.status} /> },
            { key: 'created_at', label: 'Received', render: (r) => <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString()}</span> },
            { key: 'actions', label: '', align: 'right', render: (r) => (
              <div className="flex justify-end gap-2">
                <a href={`tel:${r.phone || ""}`} className="p-2 text-stone-400 hover:text-white"><Phone className="h-4 w-4" /></a>
                <a href={`https://wa.me/${(r.whatsapp || r.phone || "").replace(/\D/g, "")}`} target="_blank" className="p-2 text-green-500 hover:text-green-400"><MessageSquare className="h-4 w-4" /></a>
                <a href={`mailto:${r.email}`} className="p-2 text-stone-400 hover:text-blue-400"><Mail className="h-4 w-4" /></a>
              </div>
            )}
          ]}
        />
      </div>
    </div>
  );
      }
      
