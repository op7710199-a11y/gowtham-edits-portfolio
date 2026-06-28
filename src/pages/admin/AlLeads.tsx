import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DataTable } from '../../components/admin/DataTable';

export function AILeadsPage() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const { data } = await supabase.from('ai_requests').select('*').order('created_at', { ascending: false });
      setLeads(data || []);
    };
    fetchLeads();
  }, []);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'tool_type', label: 'Tool' },
    { key: 'service', label: 'Service' },
    { key: 'estimated_price', label: 'Est. Price' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Date', render: (r: any) => new Date(r.created_at).toLocaleDateString() }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">AI Lead Management</h1>
      <DataTable data={leads} columns={columns} />
    </div>
  );
}
