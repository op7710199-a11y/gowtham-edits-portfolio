import { useEffect, useMemo, useState } from "react";
import {
  Search, Filter, Users, Mail, Phone, RefreshCw, Eye, Trash2, 
  Edit, X, MessageCircle, PhoneCall, Copy, Save
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  message: string;
  created_at: string;
  priority?: "Low" | "Medium" | "High";
  notes?: string;
  follow_up?: string;
  favorite?: boolean;
};

export default function Leads() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);
  const [editing, setEditing] = useState(false);

  async function loadLeads() {
    setLoading(true);
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(data || []);
    setLoading(false);
  }

  useEffect(() => { loadLeads(); }, []);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch = lead.name?.toLowerCase().includes(search.toLowerCase()) || 
                            lead.email?.toLowerCase().includes(search.toLowerCase()) || 
                            lead.phone?.includes(search);
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, leads]);

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Service", "Status"];
    const rows = filtered.map(l => [l.name, l.email, l.phone, l.service, l.status]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads.csv"; a.click();
  }

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    completed: leads.filter(l => l.status === "Completed").length
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Leads Management</h1>
          <p className="text-stone-400 mt-2">Manage all customer inquiries.</p>
        </div>
        <button onClick={loadLeads} className="bg-yellow-500 text-black px-6 py-3 rounded-xl flex items-center gap-2 font-semibold">
          <RefreshCw size={18}/> Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mt-10">
        <Card title="Total Leads" value={stats.total} icon={<Users/>}/>
        <Card title="New" value={stats.new} icon={<Mail/>}/>
        <Card title="Contacted" value={stats.contacted} icon={<Phone/>}/>
        <Card title="Completed" value={stats.completed} icon={<Users/>}/>
      </div>

      <div className="mt-10 bg-zinc-900 rounded-2xl p-6 border border-yellow-500/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 text-stone-500" size={18}/>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="w-full bg-black border border-zinc-700 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-yellow-500" />
          </div>
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="bg-black border border-zinc-700 rounded-xl px-4 py-3">
            <option>All</option><option>New</option><option>Contacted</option><option>Completed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <button onClick={exportCSV} className="bg-yellow-500 text-black px-5 py-3 rounded-xl font-semibold">Export CSV</button>
        {["Today's Leads", "High Priority", "Follow Ups"].map(btn => (
          <button key={btn} className="bg-zinc-900 border border-yellow-500/20 px-5 py-3 rounded-xl">{btn}</button>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-yellow-500/20 bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black sticky top-0">
              <tr>{["Client", "Service", "Phone", "Status", "Date", "Actions"].map(h => <th key={h} className="px-6 py-5 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="text-center py-20 text-stone-500">Loading Leads...</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-20 text-stone-500">No Leads Found</td></tr> : filtered.map(lead => (
                <tr key={lead.id} className="border-t border-zinc-800 hover:bg-zinc-800 transition">
                  <td className="px-6 py-5"><div><h3 className="font-semibold">{lead.name}</h3><p className="text-sm text-stone-400">{lead.email}</p></div></td>
                  <td>{lead.service || "-"}</td>
                  <td>{lead.phone || "-"}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-end gap-2 pr-6">
                      <button onClick={() => { setSelectedLead(lead); setEditing(false); }} className="bg-blue-500 p-2 rounded-lg hover:scale-105 transition"><Eye size={18}/></button>
                      <button onClick={() => { setSelectedLead(lead); setEditing(true); }} className="bg-yellow-500 text-black p-2 rounded-lg hover:scale-105 transition"><Edit size={18}/></button>
                      <button onClick={()=> window.open(`https://wa.me/${lead.phone}`)} className="bg-green-500 p-2 rounded-lg hover:scale-105 transition"><MessageCircle size={18}/></button>
                      <button onClick={()=>{ if(!confirm("Delete this?")) return; supabase.from("inquiries").delete().eq("id", lead.id).then(loadLeads); }} className="bg-red-500 p-2 rounded-lg hover:scale-105 transition"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-6">
          <div className="bg-zinc-900 rounded-3xl border border-yellow-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Lead Details</h2>
              <button onClick={() => setSelectedLead(null)}><X /></button>
            </div>
            <div className="space-y-4">
              <div><label>Name</label><input disabled={!editing} value={selectedLead.name} onChange={e => setSelectedLead({...selectedLead, name: e.target.value})} className="w-full bg-black border border-zinc-700 rounded-xl p-4 mt-2" /></div>
              <div><label>Email</label><input disabled={!editing} value={selectedLead.email} onChange={e => setSelectedLead({...selectedLead, email: e.target.value})} className="w-full bg-black border border-zinc-700 rounded-xl p-4 mt-2" /></div>
              <div><label>Message</label><textarea disabled={!editing} value={selectedLead.message} onChange={e => setSelectedLead({...selectedLead, message: e.target.value})} className="w-full h-32 bg-black border border-zinc-700 rounded-xl p-4 mt-2" /></div>
              <div><label>Priority</label><select disabled={!editing} value={selectedLead.priority || "Medium"} onChange={e => setSelectedLead({...selectedLead, priority: e.target.value as any})} className="w-full bg-black border border-zinc-700 rounded-xl p-4 mt-2"><option>Low</option><option>Medium</option><option>High</option></select></div>
              <div><label>Internal Notes</label><textarea disabled={!editing} value={selectedLead.notes || ""} onChange={e => setSelectedLead({...selectedLead, notes: e.target.value})} className="w-full h-28 bg-black border border-zinc-700 rounded-xl p-4 mt-2" /></div>
              <div><label>Follow Up</label><input type="date" disabled={!editing} value={selectedLead.follow_up || ""} onChange={e => setSelectedLead({...selectedLead, follow_up: e.target.value})} className="w-full bg-black border border-zinc-700 rounded-xl p-4 mt-2" /></div>
              <div className="flex gap-3">
                <button onClick={() => navigator.clipboard.writeText(selectedLead.phone)} className="bg-zinc-800 px-5 py-3 rounded-xl flex items-center gap-2"><Copy size={18}/> Copy Phone</button>
                <button onClick={async() => { await supabase.from("inquiries").update({favorite: !selectedLead.favorite}).eq("id", selectedLead.id); loadLeads(); setSelectedLead({...selectedLead, favorite: !selectedLead.favorite}); }} className="bg-yellow-500 text-black px-5 py-3 rounded-xl">⭐ {selectedLead.favorite ? " Starred" : " Add Star"}</button>
                {editing && <button onClick={async() => { await supabase.from("inquiries").update(selectedLead).eq("id", selectedLead.id); setEditing(false); loadLeads(); }} className="bg-yellow-500 text-black px-5 py-3 rounded-xl flex items-center gap-2"><Save size={18}/> Save</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
      <div className="flex justify-between">
        <div><p className="text-stone-400">{title}</p><h2 className="text-3xl font-bold mt-2">{value}</h2></div>
        <div className="bg-yellow-500 text-black p-4 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = { New: "bg-green-500/20 text-green-400", Contacted: "bg-yellow-500/20 text-yellow-400", Completed: "bg-blue-500/20 text-blue-400", Cancelled: "bg-red-500/20 text-red-400" };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-zinc-700"}`}>{status}</span>;
}
