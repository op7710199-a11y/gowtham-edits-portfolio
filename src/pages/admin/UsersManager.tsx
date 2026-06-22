import { useState } from 'react';
import { Plus, Shield, KeyRound, UserCheck, UserX, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [inviteForm, setInviteForm] = useState({ email: '', full_name: '', password: DEFAULT_TEMP_PASSWORD, role: 'editor' as UserRole });
  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('editor');
  const [resetTarget, setResetTarget] = useState<Profile | null>(null);
  const [resetting, setResetting] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Profile | null>(null);
  const log = useActivityLog();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('profiles').select('*').order('created_at');
      if (err) throw err;
      setUsers((data ?? []) as Profile[]);
    } catch {
      // table may not be accessible
    } finally {
      setLoading(false);
    }
  };

  useState(() => { fetchUsers(); });

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
        await supabase
          .from('profiles')
          .update({ role: inviteForm.role, full_name: inviteForm.full_name, must_change_password: true })
          .eq('id', data.user.id);
        await log('create', 'user', data.user.id, { email: inviteForm.email, role: inviteForm.role });
      }
      await fetchUsers();
      setInviteOpen(false);
      setInviteForm({ email: '', full_name: '', password: DEFAULT_TEMP_PASSWORD, role: 'editor' });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Invite failed');
    } finally {
      setSaving(false);
    }
  };

  const saveRole = async () => {
    if (!editTarget) return;
    // Prevent demoting the last super_admin
    if (editTarget.role === 'super_admin' && editRole !== 'super_admin') {
      const superAdminCount = users.filter((u) => u.role === 'super_admin' && u.is_active).length;
      if (superAdminCount <= 1) {
        setFormError('Cannot demote the last super admin. Promote another user first.');
        return;
      }
    }
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

  const resetPassword = async () => {
    if (!resetTarget) return;
    setResetting(true);
    setFormError('');
    try {
      const { error: err } = await supabase.auth.admin.updateUserById(resetTarget.id, {
        password: DEFAULT_TEMP_PASSWORD,
      });
      if (err) throw err;
      await supabase.from('profiles').update({ must_change_password: true }).eq('id', resetTarget.id);
      await log('reset_password', 'user', resetTarget.id, { email: resetTarget.email });
      setResetTarget(null);
      await fetchUsers();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Password reset failed');
    } finally {
      setResetting(false);
    }
  };

  const toggleActive = async (user: Profile) => {
    // Prevent suspending the last super_admin
    if (user.role === 'super_admin' && user.is_active) {
      const superAdminCount = users.filter((u) => u.role === 'super_admin' && u.is_active && u.id !== user.id).length;
      if (superAdminCount === 0) {
        setFormError('Cannot suspend the last super admin.');
        setDeactivateTarget(null);
        return;
      }
    }
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
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.full_name || 'Unnamed'}</div>
          <div className="truncate text-xs text-stone-500">{r.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (r) => (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        r.role === 'super_admin' ? 'bg-gold-500/15 text-gold-300' :
        r.role === 'admin' ? 'bg-blue-500/15 text-blue-300' :
        'bg-stone-500/15 text-stone-300'
      }`}>
        <Shield className="h-3 w-3" />
        {r.role.replace('_', ' ')}
      </span>
    )},
    { key: 'is_active', label: 'Status', render: (r) => <StatusBadge value={r.is_active} trueLabel="Active" falseLabel="Suspended" /> },
    { key: 'actions', label: '', align: 'right', render: (r) =>
      r.id !== currentUser?.id ? (
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => { setEditTarget(r); setEditRole(r.role); }} title="Edit role" className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-blue-500/10 hover:text-blue-400">
            <Shield className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setResetTarget(r)} title="Reset password" className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-amber-500/10 hover:text-amber-400">
            <KeyRound className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDeactivateTarget(r)} title={r.is_active ? 'Suspend user' : 'Reactivate user'} className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
            r.is_active ? 'text-stone-400 hover:bg-red-500/10 hover:text-red-400' : 'text-green-500 hover:bg-green-500/10'
          }`}>
            {r.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </button>
        </div>
      ) : (<span className="text-[10px] text-stone-600">You</span>)
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage admin accounts, roles, and access."
        action={<button type="button" onClick={() => setInviteOpen(true)} className="btn-primary py-2.5"><Plus className="h-4 w-4" /> Invite User</button>}
      />
      <div className="p-6">
        {formError && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{formError}</div>}
        <DataTable data={users} columns={columns} loading={loading} emptyMessage="No users found. Invite your first team member." />
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite New User">
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            New users receive the default temporary password: <code className="rounded bg-white/10 px-1.5 py-0.5 text-gold-300">{DEFAULT_TEMP_PASSWORD}</code> and must change it on first login.
          </div>
          <input type="email" placeholder="Email address" value={inviteForm.email} onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none" />
          <input type="text" placeholder="Full name (optional)" value={inviteForm.full_name} onChange={(e) => setInviteForm((f) => ({ ...f, full_name: e.target.value }))} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none" />
          <select value={inviteForm.role} onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value as UserRole }))} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 focus:border-gold-500/50 focus:outline-none">
            {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
          <div className="flex gap-3">
            <button type="button" onClick={() => setInviteOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="button" onClick={inviteUser} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Creating…' : 'Create User'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Role">
        {editTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient text-sm font-bold text-ink-950">
                {(editTarget.full_name || editTarget.email)[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">{editTarget.full_name || 'Unnamed'}</div>
                <div className="truncate text-xs text-stone-500">{editTarget.email}</div>
              </div>
            </div>
            <p className="text-xs text-stone-400">Current role: <span className="font-semibold text-gold-300">{editTarget.role.replace('_', ' ')}</span></p>
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            <select value={editRole} onChange={(e) => setEditRole(e.target.value as UserRole)} className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 focus:border-gold-500/50 focus:outline-none">
              {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
            {(editTarget.role === 'super_admin' && editRole !== 'super_admin') && (
              <p className="text-xs text-amber-300">Warning: Demoting this user will reduce super admin count.</p>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditTarget(null)} className="btn-ghost flex-1">Cancel</button>
              <button type="button" onClick={saveRole} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : 'Save Role'}</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={() => deactivateTarget && toggleActive(deactivateTarget)}
        title={deactivateTarget?.is_active ? 'Suspend user?' : 'Reactivate user?'}
        description={deactivateTarget?.is_active ? `${deactivateTarget?.email} will be suspended and unable to log in.` : `${deactivateTarget?.email} will be reactivated.`}
        confirmLabel={deactivateTarget?.is_active ? 'Suspend' : 'Reactivate'}
      />

      <Modal open={!!resetTarget} onClose={() => setResetTarget(null)} title="Reset Password">
        {resetTarget && (
          <div className="space-y-4">
            <p className="text-sm text-stone-300">Reset password for <span className="font-semibold text-white">{resetTarget.email}</span>?</p>
            <p className="text-xs text-stone-400">The password will be set to the default temporary password: <code className="rounded bg-white/10 px-1.5 py-0.5 text-gold-300">{DEFAULT_TEMP_PASSWORD}</code><br />The user will be required to change it on next login.</p>
            {formError && <p className="text-xs text-red-400">{formError}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setResetTarget(null)} className="btn-ghost flex-1">Cancel</button>
              <button type="button" onClick={resetPassword} disabled={resetting} className="btn-primary flex-1 disabled:opacity-60">{resetting ? 'Resetting…' : 'Reset Password'}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
