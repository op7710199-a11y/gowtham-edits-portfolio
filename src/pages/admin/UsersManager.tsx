import { useEffect, useState } from 'react';
import { Plus, Shield, KeyRound, UserCheck, UserX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { useAuth } from '../../context/AuthContext';
import { useActivityLog } from '../../hooks/data';
import type { Profile, UserRole } from '../../types/database';

const ROLES: UserRole[] = ['editor', 'admin', 'super_admin'];
const DEFAULT_TEMP_PASSWORD = 'gowthameditswebroly.appABCD@1234';

export function UsersManager() {
  const { profile: currentUser } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({ email: '', full_name: '', role: 'editor' as UserRole });
  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('editor');
  const [resetTarget, setResetTarget] = useState<Profile | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Profile | null>(null);
  const log = useActivityLog();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('profiles').select('*').order('created_at');
      if (err) throw err;
      setUsers((data ?? []) as Profile[]);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const inviteUser = async () => {
    if (!inviteForm.email.trim()) {
      setFormError('Email is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: inviteForm.email.trim(),
        password: DEFAULT_TEMP_PASSWORD,
        options: { data: { full_name: inviteForm.full_name } },
      });
      if (err) throw err;
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ role: inviteForm.role, full_name: inviteForm.full_name, must_change_password: true })
          .eq('id', data.user.id);
        await log('create', 'user', data.user.id, { email: inviteForm.email, role: inviteForm.role });
      }
      await fetchUsers();
      setInviteOpen(false);
      setInviteForm({ email: '', full_name: '', role: 'editor' });
    } catch (e: any) {
      setFormError(e.message || 'Invite failed');
    } finally {
      setSaving(false);
    }
  };

  const saveRole = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({ role: editRole }).eq('id', editTarget.id);
      await log('update', 'user', editTarget.id, { role: editRole });
      await fetchUsers();
      setEditTarget(null);
    } catch (e: any) {
      setFormError(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user: Profile) => {
    await supabase.from('profiles').update({ is_active: !user.is_active }).eq('id', user.id);
    await log('update', 'user', user.id, { is_active: !user.is_active });
    await fetchUsers();
    setDeactivateTarget(null);
  };

  const columns: Column<Profile>[] = [
    { key: 'full_name', label: 'Name', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-ink-950">
          {(r.full_name || r.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{r.full_name || 'Unnamed'}</div>
          <div className="text-xs text-stone-500">{r.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (r) => (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-stone-500/15 text-stone-300">
        <Shield className="h-3 w-3" /> {r.role.replace('_', ' ')}
      </span>
    )},
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge value={r.is_active} trueLabel="Active" falseLabel="Suspended" /> },
    { key: 'actions', label: '', align: 'right', render: (r) =>
      r.id !== currentUser?.id ? (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => { setEditTarget(r); setEditRole(r.role); }} className="p-2 text-stone-400 hover:text-blue-400"><Shield className="h-4 w-4" /></button>
          <button onClick={() => setResetTarget(r)} className="p-2 text-stone-400 hover:text-amber-400"><KeyRound className="h-4 w-4" /></button>
          <button onClick={() => setDeactivateTarget(r)} className={`p-2 ${r.is_active ? 'text-stone-400 hover:text-red-400' : 'text-green-500'}`}>
            {r.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </button>
        </div>
      ) : null
    },
  ];

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage team access." action={<button onClick={() => setInviteOpen(true)} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Invite</button>} />
      
      <div className="p-6">
        <DataTable
          rows={users}
          columns={columns}
          loading={loading}
          emptyMessage="No users found."
        />
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite New User">
        <div className="space-y-4">
          <input type="email" placeholder="Email" value={inviteForm.email} onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})} className="w-full p-3 rounded-xl bg-ink-900 border border-white/10" />
          <button onClick={inviteUser} className="w-full btn-primary py-3">Invite</button>
        </div>
      </Modal>
    </div>
  );
}
