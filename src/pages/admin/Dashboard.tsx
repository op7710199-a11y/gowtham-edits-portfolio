import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, DollarSign, Briefcase, MessageSquare, 
  Plus, Image as ImageIcon, Settings, Upload, Activity 
} from "lucide-react";
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLeads: 0, revenue: 0, portfolio: 0 });
  const [inquiries, setInquiries] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: leads }, { data: portfolio }] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolio_items').select('id')
      ]);

      const totalRevenue = leads?.reduce((acc, curr) => acc + (Number(curr.budget_range) || 0), 0) || 0;
      
      setStats({
        totalLeads: leads?.length || 0,
        revenue: totalRevenue,
        portfolio: portfolio?.length || 0
      });
      setInquiries(leads?.slice(0, 5) || []);
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

  const statCards = [
    { title: "Total Leads", value: stats.totalLeads.toString(), icon: MessageSquare },
    { title: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign },
    { title: "Projects", value: stats.portfolio.toString(), icon: Briefcase },
  ];

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">Welcome Back, {profile?.full_name?.split(' ')[0] || 'Admin'} 👋</h1>
          <p className="text-stone-400 mt-2">Gowtham Edits Admin Dashboard</p>
        </div>
        <button 
          onClick={fetchData} 
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {statCards.map((item) => (
          <div key={item.title} className="rounded-3xl bg-zinc-900 border border-yellow-500/20 p-6 hover:border-yellow-500 transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-stone-400">{item.title}</p>
                <h2 className="text-4xl font-bold mt-3">{item.value}</h2>
              </div>
              <div className="bg-yellow-500 p-4 rounded-2xl text-black">
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-4 gap-6 mt-12">
        {[
          { label: 'Add Portfolio', icon: Plus, bg: 'bg-yellow-500 text-black' },
          { label: 'Upload Video', icon: Upload, bg: 'bg-zinc-900' },
          { label: 'Gallery', icon: ImageIcon, bg: 'bg-zinc-900' },
          { label: 'Site Settings', icon: Settings, bg: 'bg-zinc-900' },
        ].map((btn, i) => (
          <button key={i} className={`${btn.bg} rounded-2xl p-6 font-bold flex items-center gap-3 transition hover:opacity-90`}>
            <btn.icon /> {btn.label}
          </button>
        ))}
      </div>

      {/* Recent Inquiries Table */}
      <div className="mt-12 bg-zinc-900 rounded-3xl border border-yellow-500/20 overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recent Inquiries</h2>
          <Activity className={`h-6 w-6 ${loading ? 'animate-spin text-yellow-500' : 'text-green-500'}`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-stone-400">
              <tr>
                <th className="p-4">Client</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((lead, i) => (
                <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                  <td className="p-4 font-medium">{lead.name}</td>
                  <td>{lead.service}</td>
                  <td>₹{Number(lead.budget_range || 0).toLocaleString()}</td>
                  <td>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
