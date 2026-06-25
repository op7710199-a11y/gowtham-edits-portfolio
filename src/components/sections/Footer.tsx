import { Heart, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Logo } from '../Logo';
import { useSiteSettings } from '../../hooks/useSupabaseQueries';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const FALLBACK = {
  instagram_url: 'https://www.instagram.com/gowtham.edits1_?igsh=MXc1OWw5eXg0c2NkeQ==',
  instagram_handle: 'gowtham.edits1',
  email: 'hello@gowthamedits.com',
  whatsapp_number: '+91 96768 31437',
  whatsapp_display: '+91 96768 31437',
  location: 'HYDRABAD, India • Worldwide remote',
};

export function Footer() {
  const { data: settings } = useSiteSettings();
  const s = { ...FALLBACK, ...Object.fromEntries(
    Object.entries(settings ?? {}).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)])
  ) };

  const whatsappHref = `https://wa.me/91${s.whatsapp_number.replace(/[^0-9]/g, '')}`;

  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950 pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="container-mx pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Logo href="#home" height={48} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              Cinematic video editing for weddings, haldi, pre-wedding, bike films and social
              content. Turning moments into cinematic memories.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={s.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-stone-300 transition-all hover:border-gold-500/40 hover:text-gold-100"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-stone-300 transition-all hover:border-gold-500/40 hover:text-gold-100"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${s.email}`}
                aria-label="Email"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-stone-300 transition-all hover:border-gold-500/40 hover:text-gold-100"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick nav */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Explore</h4>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-stone-400 transition-colors hover:text-gold-100"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Get in touch</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={s.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 transition-colors hover:text-gold-100"
                >
                  @{s.instagram_handle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${s.email}`}
                  className="text-stone-400 transition-colors hover:text-gold-100"
                >
                  {s.email}
                </a>
              </li>
              <li className="text-stone-400">{s.location}</li>
            </ul>
            <a
              href="#contact"
              className="btn-ghost mt-5 px-5 py-2.5 text-xs"
            >
              Inquire now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container-mx flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} GOWTHAM EDITS. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-stone-500">
  Crafted By{" "}
  <Heart
    className="h-3.5 w-3.5 text-gold-400"
    fill="currentColor"
    strokeWidth={0}
  />
  <span className="font-semibold text-gold-400">
    WEBROLY
  </span>
</p>
        </div>
      </div>
    </footer>
  );
}
