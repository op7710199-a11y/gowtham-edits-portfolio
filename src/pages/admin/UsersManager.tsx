import { useEffect, useState } from 'react';
import { Plus, UserCheck, UserX, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DataTable } from '../../components/admin/DataTable';
import { Modal, ConfirmDialog, StatusBadge, PageHeader } from '../../components/admin/AdminUI';
import { Field } from './PortfolioManager';
import type { Profile, UserRole } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { useActivityLog } from '../../hooks/data';

const ROLES: UserRole[] = ['editor', 'admin', 'super_admin'];

export function UsersManager() {
  const { profile: currentUser } = useAuth();
  const log = useActivityLog();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [inviteForm, setInviteForm] = useState({ email: '', full_name: '', password: '', role: 'editor' as UserRole });
  const [editRole, setEditRole] = useState<UserRole>('editor');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error: err } = await supabase.from('profiles').select('*').order('created_at');
    if (err) setError(err.message);
    else setUsers((data ?? []) as Profile[]);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const inviteUser = async () => {
    if (!inviteForm.email.trim() || !inviteForm.password) {
      setFormError('Email and password are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: inviteForm.email.trim(),
        password: inviteForm.password,
        options: { data: { full_name: inviteForm.full_name } },
      });
      if (err) throw err;
      if (data.user) {
        await supabase.from('profiles').update({ role: inviteForm.role, full_name: inviteForm.full_name }).eq('id', data.user.id);
        await log('create', 'user', data.user.id, { email: inviteForm.email, role: inviteForm.role });
      }
      await fetchUsers();
      setInviteOpen(false);
      setInviteForm({ email: '', full_name: '', password: '', role: 'editor' });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Invite failed');
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
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Update failed');
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

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage admin and editor accounts. Only super admins can access this page."
        action={<button type="button" onClick={() => { setInviteOpen(true); setFormError(''); }} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Invite User</button>}
      />
      <div className="p-6">
        <DataTable<Profile>
          loading={loading} error={error} rows={users} searchKeys={['email', 'full_name']}
          onEdit={(r) => {
            if (r.id !== currentUser?.id) {
              setEditTarget(r);
              setEditRole(r.role);
              setFormError('');
            }
          }}
          emptyMessage="No users found."
          columns={[
            { key: 'email', label: 'User', sortable: true, render: (r) => (
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500/10 text-sm font-bold text-gold-300">{(r.full_name || r.email || 'U')[0].toUpperCase()}</div>
                  <div><div className="text-sm font-medium text-white">{r.full_name || '(no name)'}</div><div className="text-xs text-stone-400">{r.email}</div></div>
                </div>
              )
            },
            { key: 'role', label: 'Role', render: (r) => (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                  r.role === 'super_admin' ? 'bg-gold-500/20 text-gold-200' : r.role === 'admin' ? 'bg-blue-500/15 text-blue-300' : 'bg-stone-700/40 text-stone-400'
                }`}>{r.role === 'super_admin' && <Shield className="h-3 w-3" />}{r.role.replace('_', ' ')}</span>
              )
            },
            { key: 'is_active', label: 'Active', render: (r) => <StatusBadge value={r.is_active} trueLabel="Active" falseLabel="Suspended" /> },
            { key: 'created_at', label: 'Joined', sortable: true, render: (r) => <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleDateString()}</span> },
            { key: 'actions_extra', label: '', render: (r) =>
                r.id !== currentUser?.id ? (
                  <button type="button" onClick={() => setDeactivateTarget(r)} title={r.is_active ? 'Suspend user' : 'Reactivate user'}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                      r.is_active ? 'text-stone-400 hover:bg-red-500/10 hover:text-red-400' : 'text-green-500 hover:bg-green-500/10'
                    }`}>{r.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}</button>
                ) : (<span className="text-[10px] text-stone-600">You</span>),
            },
          ]}
        />
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite New User">
        <div className="space-y-4">
          <div className="rounded-xl border border-gold-500/20 bg-gold-500/[0.05] p-3 text-xs text-stone-300">The invited user will sign in using these credentials. Send them securely.</div>
          <Field label="Full Name" value={inviteForm.full_name} onChange={(v) => setInviteForm((f) => ({ ...f, full_name: v }))} />
          <Field label="Email *" value={inviteForm.email} onChange={(v) => setInviteForm((f) => ({ ...f, email: v }))} type="email" />
          <Field label="Password *" value={inviteForm.password} onChange={(v) => setInviteForm((f) => ({ ...f, password: v }))} type="password" />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Role</label>
            <select value={inviteForm.role} onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value as UserRole }))} className="admin-select">
              {ROLES.map((r) => (<option key={r} value={r}>{r.replace('_', ' ')}</option>))}
            </select>
          </div>
          {formError && <p className="text-xs text-red-400">{formError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setInviteOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={inviteUser} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Creating…' : 'Create Account'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Change Role" maxWidth="max-w-sm">
        {editTarget && (
          <div className="space-y-4">
            <p className="text-sm text-stone-300">Update role for <strong className="text-white">{editTarget.full_name || editTarget.email}</strong></p>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Role</label>
              <select value={editRole} onChange={(e) => setEditRole(e.target.value as UserRole)} className="admin-select">
                {ROLES.map((r) => (<option key={r} value={r}>{r.replace('_', ' ')}</option>))}
              </select>
            </div>
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditTarget(null)} className="btn-ghost flex-1">Cancel</button>
              <button type="button" onClick={saveRole} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : 'Update Role'}</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deactivateTarget} onClose={() => setDeactivateTarget(null)} onConfirm={() => deactivateTarget && toggleActive(deactivateTarget)}
        title={deactivateTarget?.is_active ? 'Suspend user?' : 'Reactivate user?'}
        description={deactivateTarget?.is_active ? `${deactivateTarget?.email} will be suspended and unable to log in.` : `${deactivateTarget?.email} will be reactivated.`}
        confirmLabel={deactivateTarget?.is_active ? 'Suspend' : 'Reactivate'}
      />
    </div>
  );
}
