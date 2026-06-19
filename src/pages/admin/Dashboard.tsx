import { useEffect, useState } from 'react';
import { Images, MessageSquare, Star, Briefcase, Users, Activity, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AnalyticsCard, InquiryStatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { useAuth } from '../../context/AuthContext';
import type { Inquiry, ActivityLog } from '../../types/database';

interface Stats {
  portfolio: number;
  inquiries: number;
  testimonials: number;
  services: number;
  newInquiries: number;
}

export function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [port, inq, test, svc, acts] = await Promise.all([
          supabase.from('portfolio_items').select('id', { count: 'exact', head: true }),
          supabase.from('inquiries').select('id, name, email, service, status, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('testimonials').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(8),
        ]);
        const newInq = await supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new');
        if (!active) return;
        setStats({
          portfolio: port.count ?? 0,
          inquiries: inq.data?.length ?? 0,
          testimonials: test.count ?? 0,
          services: svc.count ?? 0,
          newInquiries: newInq.count ?? 0,
        });
        setRecentInquiries((inq.data ?? []) as Inquiry[]);
        setRecentActivity((acts.data ?? []) as ActivityLog[]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const greeting = profile?.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}` : 'Welcome back';

  return (
    <div>
      <PageHeader title={greeting} subtitle={`You are signed in as ${profile?.role?.replace('_', ' ') ?? 'staff'}`} />

      <div className="p-6 space-y-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCard label="Portfolio Items" value={stats?.portfolio ?? 0} icon={Images} />
            <AnalyticsCard label="Total Inquiries" value={stats?.inquiries ?? 0} icon={MessageSquare} />
            <AnalyticsCard label="New Inquiries" value={stats?.newInquiries ?? 0} icon={TrendingUp} accent />
            <AnalyticsCard label="Testimonials" value={stats?.testimonials ?? 0} icon={Star} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-bold text-white">Recent Inquiries</h2><a href="/admin/inquiries" className="text-xs text-gold-300 hover:text-gold-100">View all</a></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
              {loading ? (
                <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-10 animate-pulse rounded-xl bg-white/[0.04]" />))}</div>
              ) : recentInquiries.length === 0 ? (
                <div className="p-8 text-center text-sm text-stone-400">No inquiries yet.</div>
              ) : (
                recentInquiries.map((inq) => (
                  <div key={inq.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="min-w-0"><div className="truncate text-sm font-medium text-white">{inq.name}</div><div className="truncate text-xs text-stone-400">{inq.service ?? 'No service specified'}</div></div>
                    <div className="shrink-0"><InquiryStatusBadge status={inq.status} /></div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-bold text-white">Activity</h2><a href="/admin/activity" className="text-xs text-gold-300 hover:text-gold-100">View all</a></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
              {loading ? (
                <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-8 animate-pulse rounded-xl bg-white/[0.04]" />))}</div>
              ) : recentActivity.length === 0 ? (
                <div className="p-8 text-center text-sm text-stone-400">No activity yet.</div>
              ) : (
                recentActivity.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500/10 text-gold-300"><Activity className="h-3.5 w-3.5" /></span>
                    <div className="min-w-0 flex-1"><div className="truncate text-xs font-medium text-stone-200">{log.action} {log.entity}</div><div className="flex items-center gap-1 text-[10px] text-stone-500"><Clock className="h-3 w-3" />{new Date(log.created_at).toLocaleString()}</div></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-white">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Add Portfolio Item', href: '/admin/portfolio', icon: Images },
              { label: 'View Inquiries', href: '/admin/inquiries', icon: MessageSquare },
              { label: 'Edit Services', href: '/admin/services', icon: Briefcase },
              { label: 'Manage Users', href: '/admin/users', icon: Users },
            ].map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-gold-500/30 hover:bg-gold-500/[0.04]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><item.icon className="h-5 w-5" /></span>
                <span className="text-sm font-medium text-white">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
