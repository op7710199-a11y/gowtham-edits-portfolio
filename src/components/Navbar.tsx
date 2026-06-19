import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLockBody, useScrolled } from '../hooks';
import { Logo } from './Logo';

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Process', href: '#process' },
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic ${scrolled ? 'border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="container-mx flex h-16 items-center justify-between sm:h-[4.5rem]">
        <Logo href="#home" height={44} />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="relative rounded-full px-4 py-2 text-sm font-medium text-stone-300 transition-colors duration-300 hover:text-gold-100">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden rounded-full bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-ink-950 shadow-gold transition-all duration-500 ease-cinematic hover:shadow-gold-glow hover:scale-[1.04] active:scale-95 sm:inline-flex">
            Inquire Now
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-stone-200 transition-colors hover:border-gold-500/40 hover:text-gold-100 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className={`overflow-hidden border-t border-white/[0.06] bg-ink-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 ease-cinematic lg:hidden ${open ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container-mx flex items-center justify-center border-b border-white/[0.06] py-4">
          <Logo height={48} />
        </div>
        <ul className="container-mx flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={close} className="block rounded-xl px-4 py-3.5 text-base font-medium text-stone-200 transition-colors hover:bg-white/[0.04] hover:text-gold-100">
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a href="#contact" onClick={close} className="btn-primary w-full">Inquire Now</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
