import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Logo } from '../../components/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const fromError = (location.state as { error?: string } | null)?.error;
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/admin';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authErr) {
        setError(authErr.message === 'Invalid login credentials' ? 'Incorrect email or password. Please try again.' : authErr.message);
        return;
      }
      navigate(from, { replace: true });
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-ink-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(217,173,50,0.1),transparent_60%)]" />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo height={64} href="/" /></div>

        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-2 text-center">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><Lock className="h-5 w-5" /></div>
            <div><h1 className="font-display text-xl font-bold text-white">Admin Login</h1><p className="text-xs text-stone-400">Restricted access — invited users only</p></div>
          </div>

          {fromError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /><p className="text-xs text-red-200">{fromError}</p></div>
          )}

          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="admin@example.com" required className="rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Password</label>
              <div className="relative">
                <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••" required className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 pr-11 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white" tabIndex={-1} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>

            {error && (<div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /><p className="text-xs text-red-200">{error}</p></div>)}

            <button type="submit" disabled={loading || !email || !password} className="btn-primary w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? (<span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950 border-t-transparent" />Signing in…</span>) : (<span className="flex items-center justify-center gap-2"><LogIn className="h-4 w-4" />Sign in</span>)}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500">Trouble signing in? Contact the site owner.</p>
      </div>
    </div>
  );
}
