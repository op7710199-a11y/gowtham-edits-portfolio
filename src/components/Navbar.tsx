import { useEffect, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLockBody, useScrolled } from '../hooks';
import { Logo } from './Logo';

const NAV = Object.freeze([
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
]);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrolled = useScrolled(40);
  useLockBody(open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    const elements = NAV
      .map(item => document.querySelector(item.href))
      .filter(Boolean) as Element[];

    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic ${scrolled ? 'border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-2xl' : 'bg-transparent'}`}>
      <nav className="container-mx flex h-16 items-center justify-between sm:h-[4.5rem]" aria-label="Main Navigation">
        <div className="w-[170px] shrink-0">
          <Logo href="#home" height={45} />
        </div>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a 
                href={item.href} 
                aria-current={activeSection === item.href ? 'location' : undefined}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeSection === item.href ? 'text-gold-400' : 'text-stone-300 hover:text-gold-100'}`}
              >
                {item.label === 'AI Tools' && <Sparkles className="h-3 w-3 text-gold-400" aria-hidden="true" />}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" aria-label="Contact Me" className="hidden rounded-full bg-gold-gradient px-6 py-2.5 text-sm font-semibold text-ink-950 shadow-gold transition-all hover:shadow-gold-glow hover:scale-[1.04] lg:inline-block">
            Get Free Quote
          </a>
          <button 
            type="button" 
            onClick={() => setOpen((v) => !v)} 
            aria-label={open ? 'Close menu' : 'Open menu'} 
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-stone-200 transition-colors hover:border-gold-500/40 hover:text-gold-100 lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer with smooth transition */}
      <div 
        id="mobile-menu"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-white/[0.06] bg-ink-950/95 backdrop-blur-2xl transition-[max-height,opacity] duration-500 ease-cinematic lg:hidden ${
          open 
            ? 'max-h-[600px] opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div aria-hidden="true" className="container-mx flex items-center justify-center border-b border-white/[0.06] py-5">
          <div onClick={close}>
            <Logo href="#home" height={50} />
          </div>
        </div>
        <ul className="container-mx flex flex-col gap-1 py-4">
          {NAV.map((item, index) => (
            <li key={item.href} style={{ transitionDelay: `${index * 50}ms` }} className={`transition-all duration-500 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              <a 
                href={item.href} 
                onClick={close}
                aria-current={activeSection === item.href ? 'location' : undefined}
                className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-medium text-stone-200 hover:bg-white/[0.04] hover:text-gold-100 transition-colors"
              >
                {item.label === 'AI Tools' && <Sparkles className="h-4 w-4 text-gold-400" aria-hidden="true" />}
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a href="#contact" aria-label="Contact Me" onClick={close} className="btn-primary w-full text-center">Get Free Quote</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
