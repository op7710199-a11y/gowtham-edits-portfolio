import { Heart, Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { Logo } from '../Logo';
import { useSiteSettings } from '../../hooks/useSupabaseQueries';

const NAV_LINKS = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export function Footer() {
  const { data: settings } = useSiteSettings();
  
  return (
    <footer className="relative bg-black text-white">
      {/* Premium CTA Banner */}
      <section className="relative overflow-hidden border-t border-gold-500/20 bg-gold-gradient py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,.1),transparent_65%)]" />
        <div className="container-mx relative text-center">
          <span className="mb-4 inline-block rounded-full bg-black/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
            Let's Work Together
          </span>
          <h2 className="mx-auto max-w-3xl text-4xl font-bold text-black md:text-6xl">
            Ready to bring your story to life?
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#contact" className="rounded-full bg-black px-8 py-4 font-bold text-white transition hover:scale-105 hover:shadow-xl">Get Free Quote</a>
            <a href="#portfolio" className="rounded-full border-2 border-black px-8 py-4 font-bold text-black transition hover:bg-black hover:text-white">View Portfolio</a>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <section className="relative container-mx pt-20 pb-12 border-t border-gold-500/10">
        <div className="grid gap-16 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo href="#home" height={60} />
            <p className="mt-6 max-w-md text-stone-400 leading-8">
              Crafting cinematic wedding films, reels, and commercials with premium storytelling and professional post-production.
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-display text-xl text-white">Quick Links</h4>
            <ul className="space-y-4 text-stone-400">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><a href={l.href} className="hover:text-gold-400 transition">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-display text-xl text-white">Connect</h4>
            <div className="flex gap-4">
              {[Instagram, Youtube, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/20 bg-white/[0.03] transition hover:bg-gold-gradient hover:text-black">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-8 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-600">
            © {new Date().getFullYear()} GOWTHAM EDITS. ALL RIGHTS RESERVED.
          </p>
          <p className="flex items-center gap-2 text-xs text-stone-500">
            CRAFTED BY <Heart className="h-3.5 w-3.5 text-gold-400" fill="currentColor" /> 
            <span className="font-bold tracking-wider text-gold-400">WEBROLY</span>
          </p>
        </div>
      </section>
    </footer>
  );
}
