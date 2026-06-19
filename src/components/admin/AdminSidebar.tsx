import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Images,
  Briefcase,
  DollarSign,
  Star,
  MessageSquare,
  Users,
  Settings,
  Search,
  Activity,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo';

const NAV = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/portfolio', icon: Images, label: 'Portfolio', roles: ['super_admin', 'admin', 'editor'] },
  { path: '/admin/services', icon: Briefcase, label: 'Services', roles: ['super_admin', 'admin'] },
  { path: '/admin/pricing', icon: DollarSign, label: 'Pricing', roles: ['super_admin', 'admin'] },
  { path: '/admin/testimonials', icon: Star, label: 'Testimonials', roles: ['super_admin', 'admin'] },
  { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries', roles: ['super_admin', 'admin'] },
  { path: '/admin/faqs', icon: Search, label: 'FAQs', roles: ['super_admin', 'admin'] },
  { path: '/admin/users', icon: Users, label: 'Users', roles: ['super_admin'] },
  { path: '/admin/settings', icon: Settings, label: 'Site Settings', roles: ['super_admin'] },
  { path: '/admin/activity', icon: Activity, label: 'Activity Log', roles: ['super_admin', 'admin'] },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const allowed = NAV.filter(
    (n) => profile && (n.roles as string[]).includes(profile.role)
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside
      className={`flex h-screen flex-col border-r border-white/[0.06] bg-ink-950 transition-all duration-300 ease-cinematic ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        {!collapsed && <Logo href="/" height={36} />}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-2">
          {allowed.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-100'
                      : 'text-stone-400 hover:bg-white/[0.04] hover:text-white'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        {!collapsed && profile && (
          <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-3 py-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-ink-950">
              {(profile.full_name || profile.email || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">
                {profile.full_name || 'Admin'}
              </div>
              <div className="truncate text-[10px] capitalize text-stone-500">
                {profile.role.replace('_', ' ')}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 grid h-9 place-items-center rounded-lg text-stone-400 hover:bg-white/[0.05] hover:text-white"
            title="View site"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex-1 grid h-9 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
