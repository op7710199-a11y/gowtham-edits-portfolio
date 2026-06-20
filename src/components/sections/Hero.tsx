import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Play, MessageCircle, Sparkles } from 'lucide-react';
import { useCountUp } from '../../hooks';
import { Logo } from '../Logo';
import { useHeroSettings } from '../../hooks/useHeroSettings';

function StatCounter({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { ref, value: v } = useCountUp(value, 2000);
  return (
    <div className="text-center px-3">
      <div className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
        <span ref={ref}>{v}</span>
        <span className="text-gradient-gold">{suffix}</span>
      </div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400 sm:text-xs">
        {label}
      </div>
    </div>
  );
}

export function Hero() {
  const { hero, stats } = useHeroSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  const whatsappNum = '919000000000';

  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10">
        {/* Fallback image always present */}
        <img
          src={hero.bg_image_url || 'https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1920'}
          alt=""
          loading="eager"
          fetchPriority="high"
          className={`h-full w-full object-cover transition-opacity duration-1000 ${hero.is_video_enabled && videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Video background */}
        {hero.is_video_enabled && hero.video_url && (
          <video
            ref={videoRef}
            src={hero.video_url}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/75 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/40 to-ink-950/80" />
      </div>

      {/* ── Glow accents ── */}
      <div className="pointer-events-none absolute -top-1/4 left-1/2 -z-10 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-gold-500/12 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[40vh] w-[50vh] rounded-full bg-gold-600/8 blur-[100px]" />

      {/* ── Film-grain overlay ── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\' /%3E%3C/filter%3E%3Crect width=\'256\' height=\'256\' fill=\'%23fff\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px' }} />

      <div className="container-mx flex min-h-[100svh] flex-col justify-center pb-16 pt-28">
        <div className="max-w-4xl">
          {/* Logo reveal */}
          <div className={`transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0ms' }}>
            <Logo height={64} />
          </div>

          {/* Eyebrow */}
          <div className={`mt-8 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '150ms' }}>
            <span className="eyebrow">
              <span className="h-px w-8 bg-gradient-to-r from-gold-500 to-transparent" />
              Cinematic Video Editor
              <span className="h-px w-8 bg-gradient-to-l from-gold-500 to-transparent" />
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`mt-6 font-display text-5xl font-bold leading-[0.92] tracking-tight text-white transition-all duration-1000 ease-cinematic sm:text-6xl lg:text-7xl xl:text-8xl ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '300ms', textShadow: '0 4px 40px rgba(0,0,0,0.7)' }}
          >
            {hero.headline.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'shimmer-text' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className={`mt-6 max-w-2xl font-serif text-lg italic leading-relaxed text-stone-300 transition-all duration-1000 ease-cinematic sm:text-xl ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '450ms' }}>
            {hero.subheadline}
          </p>

          {/* CTAs */}
          <div className={`mt-10 flex flex-wrap items-center gap-3 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '600ms' }}>
            <a href="#portfolio" className="btn-primary group text-base px-8 py-4">
              <Play className="h-4 w-4" fill="currentColor" />
              {hero.cta_primary}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="btn-ghost group text-base px-8 py-4">
              <Sparkles className="h-4 w-4" />
              {hero.cta_secondary}
            </a>
            <a
              href={`https://wa.me/${whatsappNum}?text=Hi, I'd like to discuss a video editing project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-6 py-4 text-sm font-semibold text-green-300 transition-all hover:border-green-400/60 hover:bg-green-500/20"
            >
              <MessageCircle className="h-4 w-4" />
              {hero.cta_whatsapp}
            </a>
          </div>

          {/* Scroll hint pill */}
          <div className={`mt-12 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '800ms' }}>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-stone-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
              </span>
              Available for new projects
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        {stats.length > 0 && (
          <div className={`mt-16 sm:mt-24 transition-all duration-1000 ease-cinematic ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '950ms' }}>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5" />
              <div className={`relative grid gap-6 ${stats.length <= 3 ? 'grid-cols-3' : stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}`}>
                {stats.map((s, i) => (
                  <div key={s.id} className={i < stats.length - 1 ? 'border-r border-white/[0.08]' : ''}>
                    <StatCounter value={Number(s.value)} label={s.label} suffix={s.suffix} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
        <div className="h-10 w-px bg-gradient-to-b from-gold-500/80 to-transparent" />
        <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400">Scroll</span>
      </div>
    </section>
  );
}
