import { useEffect, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLockBody, useScrolled } from '../hooks';
import { Logo } from './Logo';

const NAV = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(40);
  useLockBody(open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic ${scrolled ? 'border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-2xl' : 'bg-transparent'}`}>
      <nav className="container-mx flex h-16 items-center justify-between sm:h-[4.5rem]">
        <Logo href="#home" height={42} />

        {/* Desktop */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-stone-300 transition-colors hover:text-gold-100">
                {item.label === 'AI Tools' && <Sparkles className="h-3 w-3 text-gold-400" />}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden rounded-full bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-ink-950 shadow-gold transition-all hover:shadow-gold-glow hover:scale-[1.04] active:scale-95 sm:inline-flex">
            Get Free Quote
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-stone-200 transition-colors hover:border-gold-500/40 hover:text-gold-100 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`overflow-hidden border-t border-white/[0.06] bg-ink-950/95 backdrop-blur-2xl transition-[max-height,opacity] duration-500 ease-cinematic lg:hidden ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container-mx flex items-center justify-center border-b border-white/[0.06] py-5">
          <Logo height={50} />
        </div>
        <ul className="container-mx flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={close}
                className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-medium text-stone-200 hover:bg-white/[0.04] hover:text-gold-100 transition-colors">
                {item.label === 'AI Tools' && <Sparkles className="h-4 w-4 text-gold-400" />}
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a href="#contact" onClick={close} className="btn-primary w-full">Get Free Quote</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
