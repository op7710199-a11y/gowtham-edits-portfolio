import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-ink-900 shadow-gold animate-scale-in"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-ink-900 px-6 py-4">
          <h2 className="font-display text-lg font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-stone-300 hover:border-gold-500/30 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Delete',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      {description && (
        <p className="mb-6 text-sm leading-relaxed text-stone-300">{description}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost flex-1 py-2.5"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-400 active:scale-95 disabled:opacity-60"
        >
          {loading ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

interface StatusBadgeProps {
  value: boolean | string;
  trueLabel?: string;
  falseLabel?: string;
}

export function StatusBadge({ value, trueLabel = 'Published', falseLabel = 'Draft' }: StatusBadgeProps) {
  const isTrue = value === true || value === 'new' || value === 'published';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
        isTrue
          ? 'bg-green-500/15 text-green-300'
          : 'bg-stone-700/40 text-stone-400'
      }`}
    >
      {typeof value === 'boolean' ? (value ? trueLabel : falseLabel) : value}
    </span>
  );
}

export function InquiryStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-blue-500/15 text-blue-300',
    contacted: 'bg-yellow-500/15 text-yellow-300',
    converted: 'bg-green-500/15 text-green-300',
    closed: 'bg-stone-600/40 text-stone-400',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
        map[status] ?? 'bg-stone-600/40 text-stone-400'
      }`}
    >
      {status}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-400">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AnalyticsCard({
  label,
  value,
  change,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? 'border-gold-500/30 bg-gold-500/[0.06]'
          : 'border-white/[0.06] bg-white/[0.03]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">{label}</span>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            accent ? 'bg-gold-gradient text-ink-950' : 'bg-white/[0.05] text-stone-300'
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 font-display text-3xl font-bold text-white">{value}</div>
      {change && <div className="mt-1 text-xs text-stone-500">{change}</div>}
    </div>
  );
}
