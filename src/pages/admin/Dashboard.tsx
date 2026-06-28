import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart3, TrendingUp, Users, Target, Activity, DollarSign, MessageSquare, Images } from 'lucide-react';
import { PageHeader, AnalyticsCard } from '../../components/admin/AdminUI';
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    monthlyLeads: 0,
    estRevenue: 0,
    convRate: 0,
    portfolio: 0
  });

  const fetchData = useCallback(async () => {
    try {
      const [
        { data: leads }, 
        { count: portfolioCount }
      ] = await Promise.all([
        supabase.from('inquiries').select('status, created_at'),
        supabase.from('portfolio_items').select('id', { count: 'exact', head: true })
      ]);
      
      let revenue = 0;
      try {
        const { data: aiTools } = await supabase.from("ai_requests").select("estimated_price");
        revenue = aiTools?.reduce((sum, item) => sum + (Number(item.estimated_price) || 0), 0) || 0;
      } catch {
        revenue = 0;
      }
      
      const total = leads?.length || 0;
      const converted = leads?.filter(l => l.status === 'converted').length || 0;

      setStats({
        totalLeads: total,
        monthlyLeads: leads?.filter(l => {
          const date = new Date(l.created_at);
          return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear();
        }).length || 0,
        estRevenue: revenue,
        convRate: total > 0 ? Math.round((converted / total) * 100) : 0,
        portfolio: portfolioCount || 0
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const greeting = profile?.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}` : 'Welcome back';

  return (
    <div>
      <PageHeader title={greeting} subtitle="Overview of your business performance and lead pipeline." />
      
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard label="Total Leads" value={stats.totalLeads} icon={Users} />
          <AnalyticsCard label="Monthly Leads" value={stats.monthlyLeads} icon={TrendingUp} />
          <AnalyticsCard label="Est. Revenue" value={`₹${stats.estRevenue.toLocaleString()}`} icon={DollarSign} />
          <AnalyticsCard label="Conversion Rate" value={`${stats.convRate}%`} icon={Target} />
        </div>

        <div className="p-10 rounded-3xl border border-white/5 bg-white/[0.02] text-center">
          <Activity className={`h-10 w-10 mx-auto mb-4 ${loading ? 'animate-pulse text-stone-700' : 'text-gold-500'}`} />
          <h3 className="text-lg font-medium text-white">Analytics Engine Active</h3>
          <p className="text-stone-500 mt-2">Data refreshing every 30 seconds.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Manage Portfolio', href: '/admin/portfolio', icon: Images },
              { label: 'View Leads', href: '/admin/inquiries', icon: MessageSquare },
              { label: 'AI Leads', href: '/admin/aileads', icon: BarChart3 },
              { label: 'Site Settings', href: '/admin/settings', icon: Activity },
            ].map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-gold-500/30 transition-all">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><item.icon className="h-5 w-5" /></span>
                <span className="text-sm font-semibold text-white">{item.label}</span>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
