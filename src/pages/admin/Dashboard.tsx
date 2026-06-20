import { useEffect, useState } from 'react';
import { Images, MessageSquare, TrendingUp, Clock, Activity, DollarSign, BarChart2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AnalyticsCard, InquiryStatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { useAuth } from '../../context/AuthContext';
import type { Inquiry, ActivityLog } from '../../types/database';

interface Stats {
  portfolio: number;
  totalInquiries: number;
  newInquiries: number;
  testimonials: number;
  services: number;
  convertedInquiries: number;
  inProgressInquiries: number;
}

interface FunnelStep { label: string; count: number; color: string; }

export function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [port, inq, test, svc, acts, newInq, converted, inProgress] = await Promise.all([
          supabase.from('portfolio_items').select('id', { count: 'exact', head: true }),
          supabase.from('inquiries').select('id, name, email, service, project_type, status, budget_range, created_at').order('created_at', { ascending: false }).limit(6),
          supabase.from('testimonials').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('activity_logs').select('*, profile:profiles(full_name, email)').order('created_at', { ascending: false }).limit(10),
          supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'converted'),
          supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
        ]);
        if (!active) return;

        

        setStats({
          portfolio: port.count ?? 0,
          totalInquiries: inq.data?.length ?? 0,
          newInquiries: newInq.count ?? 0,
          testimonials: test.count ?? 0,
          services: svc.count ?? 0,
          convertedInquiries: converted.count ?? 0,
          inProgressInquiries: inProgress.count ?? 0,
        });
        setRecentInquiries((inq.data ?? []) as unknown as Inquiry[]);
        setRecentActivity((acts.data ?? []) as ActivityLog[]);

        // Build funnel
        
        setFunnel([
          { label: 'New', count: newInq.count ?? 0, color: 'bg-blue-500' },
          { label: 'In Progress', count: inProgress.count ?? 0, color: 'bg-yellow-500' },
          { label: 'Converted', count: converted.count ?? 0, color: 'bg-green-500' },
        ]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const greeting = profile?.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}` : 'Welcome back';
  const conversionRate = stats && stats.totalInquiries > 0
    ? Math.round((stats.convertedInquiries / stats.totalInquiries) * 100)
    : 0;

  return (
    <div>
      <PageHeader title={greeting} subtitle={`Signed in as ${profile?.role?.replace('_', ' ') ?? 'staff'} · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}`} />

      <div className="p-6 space-y-8">
        {/* Analytics cards */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCard label="Portfolio Items" value={stats?.portfolio ?? 0} icon={Images} />
            <AnalyticsCard label="Total Inquiries" value={stats?.totalInquiries ?? 0} icon={MessageSquare} />
            <AnalyticsCard label="New Leads" value={stats?.newInquiries ?? 0} icon={TrendingUp} accent />
            <AnalyticsCard label="Conversion Rate" value={`${conversionRate}%`} icon={BarChart2} />
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Recent Inquiries */}
          <div className="xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Recent Leads</h2>
              <a href="/admin/inquiries" className="text-xs text-gold-300 hover:text-gold-100">View all →</a>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 m-3 animate-pulse rounded-xl bg-white/[0.04]" />)
              ) : recentInquiries.length === 0 ? (
                <div className="p-8 text-center text-sm text-stone-400">No inquiries yet. Share your portfolio to start getting leads!</div>
              ) : (
                recentInquiries.map((inq) => (
                  <div key={inq.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">{inq.name}</span>
                        {(inq as Inquiry & { budget_range?: string }).budget_range && (
                          <span className="hidden sm:inline text-[10px] rounded-full bg-gold-500/10 px-2 py-0.5 text-gold-300">
                            {(inq as Inquiry & { budget_range?: string }).budget_range}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-400">{inq.service ?? (inq as Inquiry & { project_type?: string }).project_type ?? inq.email}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <InquiryStatusBadge status={inq.status} />
                      <span className="hidden text-xs text-stone-500 sm:block">{new Date(inq.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lead funnel + activity */}
          <div className="space-y-6">
            {/* Funnel */}
            <div>
              <h2 className="mb-4 font-display text-lg font-bold text-white">Lead Funnel</h2>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
                {funnel.map((step) => (
                  <div key={step.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-stone-300 font-medium">{step.label}</span>
                      <span className="text-stone-400">{step.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${step.color} transition-all duration-700`}
                        style={{ width: stats?.totalInquiries ? `${Math.round((step.count / stats.totalInquiries) * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
                {!loading && (
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-stone-400">Conversion rate</span>
                    <span className="font-bold text-gold-300">{conversionRate}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">Activity</h2>
                <a href="/admin/activity" className="text-xs text-gold-300 hover:text-gold-100">All →</a>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
                {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 m-3 animate-pulse rounded-xl bg-white/[0.04]" />) :
                  recentActivity.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500/10 text-gold-300">
                        <Activity className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium text-stone-200 capitalize">{log.action} {log.entity}</div>
                        <div className="flex items-center gap-1 text-[10px] text-stone-500">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-white">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Add Portfolio Item', href: '/admin/portfolio', icon: Images, desc: 'Upload new project' },
              { label: 'View Leads', href: '/admin/inquiries', icon: MessageSquare, desc: 'Manage inquiries' },
              { label: 'Edit Hero', href: '/admin/hero', icon: TrendingUp, desc: 'Change hero content' },
              { label: 'Edit Pricing', href: '/admin/pricing', icon: DollarSign, desc: 'Update packages' },
            ].map((item) => (
              <a key={item.href} href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-gold-500/30 hover:bg-gold-500/[0.04] group">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-300 group-hover:bg-gold-gradient group-hover:text-ink-950 transition-all">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-stone-500">{item.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
