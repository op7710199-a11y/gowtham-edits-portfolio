import { Instagram, Mail, MessageCircle, Heart, ArrowUpRight, Youtube, Facebook, Linkedin } from 'lucide-react';
import { Logo } from '../Logo';
import { useSiteSettings } from '../../hooks/useSupabaseQueries';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

const FALLBACK = {
  instagram_url: 'https://www.instagram.com/gowtham.edits1',
  email: 'gowthamedits37@gmail.com',
  whatsapp_number: '+91 9676831437',
  location: 'Hyderabad, Telangana, India, Worldwide',
};

export function Footer() {
  const { data: settings } = useSiteSettings();
  const s = { ...FALLBACK, ...Object.fromEntries(Object.entries(settings ?? {}).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)])) };

  return (
    <footer className="relative overflow-hidden border-t border-gold-500/20 bg-black pt-24 pb-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(198,146,33,0.08),transparent_65%)]" />
      <div className="absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[180px]" />

      <div className="container-mx">
        <div className="grid gap-16 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Logo href="#home" height={70} />
            <p className="mt-6 max-w-md leading-8 text-stone-400">
              Creating cinematic stories with luxury editing, professional color grading and premium visual experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 font-display text-xl text-white">Quick Links</h4>
            <div className="mb-6 h-1 w-12 rounded-full bg-gold-gradient" />
            <ul className="space-y-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-stone-400 transition-all duration-300 hover:text-gold-400 hover:translate-x-1">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Cards */}
          <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            {[
              { label: 'WhatsApp', value: s.whatsapp_number, href: `https://wa.me/${s.whatsapp_number.replace(/\D/g,'')}` },
              { label: 'Email', value: s.email, href: `mailto:${s.email}` },
              { label: 'Location', value: s.location, href: '#' },
            ].map((item, i) => (
              <a key={i} href={item.href} className="group rounded-2xl border border-gold-500/20 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-gold-400 hover:shadow-[0_0_30px_rgba(198,146,33,.25)]">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold-500">{item.label}</div>
                <div className="mt-1 font-semibold text-white">{item.value}</div>
              </a>
            ))}
          </div>
        </div>

        <hr className="my-12 border-gold-500/10" />

        {/* Social & Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex gap-4">
            {[Instagram, Youtube, Facebook, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="group flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/20 bg-black/30 transition-all duration-500 hover:bg-gold-gradient hover:text-black hover:scale-110 hover:shadow-[0_0_30px_rgba(198,146,33,.5)]">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
              © {new Date().getFullYear()} GOWTHAM EDITS. ALL RIGHTS RESERVED.
            </p>
            <p className="mt-2 flex items-center justify-center md:justify-end gap-2 text-xs text-stone-500">
              CRAFTED BY <Heart className="h-3.5 w-3.5 text-gold-400" fill="currentColor" /> 
              <span className="text-gradient-gold font-bold tracking-wider">WEBROLY</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
