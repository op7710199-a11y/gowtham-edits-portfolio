import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronRight, Play, MessageCircle, Sparkles } from 'lucide-react';
import { useCountUp } from '../../hooks';
import { useHeroSettings, useSiteSettings } from '../../hooks/useSupabaseQueries';

function StatCounter({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { ref, value: v } = useCountUp(value, 2000);
  return (
    <div className="text-center px-3" aria-label={`${value}${suffix} ${label}`}>
      <div className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
        <span ref={ref} aria-hidden="true">{v}</span>
        <span className="text-gradient-gold" aria-hidden="true">{suffix}</span>
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 sm:text-xs" aria-hidden="true">
        {label}
      </div>
    </div>
  );
}

export function Hero() {
  const { hero, stats, loading: heroLoading } = useHeroSettings();
  const { data: settings } = useSiteSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const safeHero = hero ?? {
    headline: "Crafting Cinematic Stories",
    subheadline: "Professional video editing for weddings, reels and commercials.",
    cta_primary: "View Portfolio",
    cta_secondary: "Let's Talk",
    cta_whatsapp: "WhatsApp",
    bg_image_url: "",
    video_url: "",
    is_video_enabled: false,
  };

  const safeStats = stats ?? [];
  const whatsappNum = settings?.whatsapp_number?.toString().replace(/\D/g, "") ?? "919676831437";
  const words = useMemo(() => safeHero.headline.split(" "), [safeHero.headline]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handler = () => {
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [loadVideo]);

  if (heroLoading) {
    return null;
  }

  const getGridCols = (length: number) => {
    if (length === 3) return 'grid-cols-3';
    if (length === 4) return 'grid-cols-2 sm:grid-cols-4';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
  };

  return (
    <section ref={sectionRef} id="home" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={safeHero.bg_image_url || 'https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1920'}
          alt=""
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          fetchPriority="high"
          className={`h-full w-full object-cover transition-opacity duration-1000 ${safeHero.is_video_enabled && videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        {safeHero.is_video_enabled && safeHero.video_url && loadVideo && (
          <video
            ref={videoRef}
            src={safeHero.video_url}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            poster={safeHero.bg_image_url}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate"
            onCanPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/75 to-ink-950" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/40 to-ink-950/80" />
      </div>

      <div className="pointer-events-none absolute -top-1/4 left-1/2 -z-10 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-gold-500/12 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[40vh] w-[50vh] rounded-full bg-gold-600/8 blur-[100px]" aria-hidden="true" />

      <div className="container-mx flex min-h-[100svh] flex-col justify-center pb-16 pt-28">
        <div className="max-w-5xl pt-10">
          <div className={`transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <img src="/logo.png" alt="Gowtham Edits" className="w-[240px] md:w-[320px] drop-shadow-[0_0_40px_rgba(198,146,33,0.35)]" />
          </div>

          <div className={`mt-8 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '150ms' }}>
            <div className="inline-flex items-center gap-4">
              <div className="h-px w-12 bg-gold-500" aria-hidden="true" />
              <span className="uppercase tracking-[0.45em] text-gold-400 text-xs">CINEMATIC VIDEO EDITOR</span>
              <div className="h-px w-12 bg-gold-500" aria-hidden="true" />
            </div>
          </div>

          <h1
            className={`mt-8 font-display text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.9] font-bold text-white transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '300ms', textShadow: '0 4px 40px rgba(0,0,0,0.7)' }}
          >
            Crafting<br />
            Cinematic<br />
            <span className="text-gradient-gold">Stories</span>
          </h1>

          <p className={`mt-8 max-w-2xl text-xl leading-9 text-stone-300 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '450ms' }}>
            Creating cinematic edits that transform ordinary footage into unforgettable visual stories for weddings, brands and creators.
          </p>

          <div 
            className={`mt-12 flex flex-wrap gap-5 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: "600ms" }}
          >
            <a
              href="#portfolio"
              className="group relative overflow-hidden rounded-full bg-gold-gradient px-9 py-4 text-black font-semibold text-lg shadow-gold transition-all duration-500 hover:scale-105 hover:shadow-gold-glow"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play className="h-5 w-5 fill-current" />
                {safeHero.cta_primary}
                <ChevronRight className="transition-transform group-hover:translate-x-2" />
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100"></div>
            </a>

            <a
              href="#contact"
              className="group rounded-full border border-gold-500/30 bg-white/[0.03] backdrop-blur-xl px-9 py-4 text-lg text-white transition hover:border-gold-400 hover:bg-gold-500/10"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-gold-400" />
                {safeHero.cta_secondary}
              </div>
            </a>

            <a
              href={`https://wa.me/${whatsappNum}?text=Hi, I'd like to discuss a video editing project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full border border-green-500/40 bg-green-500/10 px-9 py-4 text-lg text-green-300 transition hover:bg-green-500/20 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                {safeHero.cta_whatsapp}
              </div>
            </a>
          </div>
        </div>

        {safeStats.length > 0 && (
          <div className={`mt-16 sm:mt-24 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '950ms' }}>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8">
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5" />
              <div className={`grid ${getGridCols(safeStats.length)} divide-x divide-white/[0.08]`}>
                {safeStats.map((s) => (
                  <div key={s.id}>
                    <StatCounter value={Number(s.value)} label={s.label} suffix={s.suffix} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
