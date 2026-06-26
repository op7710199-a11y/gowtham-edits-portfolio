import { useEffect, useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSupabaseQueries';

const FALLBACK_WHATSAPP = 'XXXXXXXXXX';

export function FloatingWhatsApp() {
  const { data: settings } = useSiteSettings();
  const raw = (settings?.whatsapp_number as string) ?? FALLBACK_WHATSAPP;
  const href = `https://wa.me/91${raw.replace(/[^0-9]/g, '')}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-[5.5rem] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-500 hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6">
      <MessageCircle className="h-6 w-6" strokeWidth={2} />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />
    </a>
  );
}

export function MobileCTABar() {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    // Scroll visibility
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Footer intersection observer
    const footer = document.querySelector("footer");
    const observer = footer ? new IntersectionObserver(
      ([entry]) => setHide(entry.isIntersecting),
      { threshold: 0.2 }
    ) : null;

    if (footer && observer) observer.observe(footer);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  if (hide) return null;

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-gold-500/10 bg-black/90 px-4 py-3 backdrop-blur-xl transition-transform duration-500 sm:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
      <a href="#portfolio" className="btn-ghost flex-1 py-3 text-sm">View Work</a>
      <a href="#contact" className="btn-primary flex-1 py-3 text-sm">Inquire Now</a>
    </div>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
      className={`fixed bottom-[5.5rem] left-4 z-30 hidden h-12 w-12 place-items-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-100 backdrop-blur-md transition-all duration-500 hover:border-gold-400 hover:bg-gold-500/20 sm:bottom-6 sm:left-6 sm:grid ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
      <ArrowUp className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}
