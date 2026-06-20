import { Logo } from './Logo';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(217,173,50,0.12),transparent_60%)]" />
      <div className="relative">
        <Logo height={100} />
      </div>
      <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-ink-800">
        <div className="h-full w-full animate-[shimmer_1.5s_linear_infinite] bg-gold-gradient origin-left" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-stone-500">Loading…</p>
    </div>
  );
}
