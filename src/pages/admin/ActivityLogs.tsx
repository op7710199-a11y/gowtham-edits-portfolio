import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PageHeader } from '../../components/admin/AdminUI';
import type { ActivityLog } from '../../types/database';
import { Activity, Clock, Filter } from 'lucide-react';

const ENTITIES = ['all', 'portfolio', 'service', 'pricing', 'testimonial', 'inquiry', 'user', 'faq'];

export function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      let q = supabase
        .from('activity_logs')
        .select('*, profile:profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (entityFilter !== 'all') q = q.eq('entity', entityFilter);

      const { data } = await q;
      if (active) setLogs((data ?? []) as ActivityLog[]);
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [entityFilter, page]);

  const ACTION_COLORS: Record<string, string> = {
    create: 'text-green-400 bg-green-500/10',
    update: 'text-blue-400 bg-blue-500/10',
    delete: 'text-red-400 bg-red-500/10',
    login: 'text-gold-300 bg-gold-500/10',
    default: 'text-stone-400 bg-stone-700/30',
  };

  return (
    <div>
      <PageHeader title="Activity Log" subtitle="Immutable audit trail of all admin actions." />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-stone-400" />
          {ENTITIES.map((e) => (
            <button key={e} type="button" onClick={() => { setEntityFilter(e); setPage(0); }}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
                entityFilter === e ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-stone-400 hover:border-gold-500/30 hover:text-white'
              }`}>{e}</button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />))}
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-sm text-stone-400">No activity recorded yet.</div>
          ) : (
            logs.map((log) => {
              const colorClass = ACTION_COLORS[log.action] ?? ACTION_COLORS.default;
              return (
                <div key={log.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${colorClass}`}><Activity className="h-4 w-4" /></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                      <span className={`rounded px-1.5 py-0.5 text-xs font-semibold uppercase ${colorClass}`}>{log.action}</span>
                      <span className="font-medium text-stone-200">{log.entity}</span>
                      {log.details && typeof log.details === 'object' && 'title' in log.details && (<span className="text-stone-400">— {String(log.details.title)}</span>)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                      <Clock className="h-3 w-3" />{new Date(log.created_at).toLocaleString()}
                      {log.profile && (<span>by {log.profile.full_name || log.profile.email}</span>)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="btn-ghost py-2 px-5 text-xs disabled:opacity-40">Previous</button>
          <span className="text-xs text-stone-500">Page {page + 1}</span>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={logs.length < PAGE_SIZE} className="btn-ghost py-2 px-5 text-xs disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
