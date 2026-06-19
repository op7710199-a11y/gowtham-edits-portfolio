import { ChevronRight, Clapperboard, Play } from 'lucide-react';
import { useCountUp } from '../../hooks';
import { Logo } from '../Logo';

function Stat({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-bold text-white sm:text-4xl">
        <span ref={ref}>{v}</span>
        <span className="text-gradient-gold">{suffix}</span>
      </div>
      <div className="mt-1.5 text-xs font-medium uppercase tracking-[0.2em] text-stone-400 sm:text-sm">
        {label}
      </div>
    </div>
  );
}

interface StatData { value: number; label: string; suffix: string; }
interface Props { stats: StatData[]; }

export function Hero({ stats }: Props) {
  return (
    <section id="home" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          loading="eager"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/80 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/40 to-ink-950/85" />
      </div>

      <div className="pointer-events-none absolute -top-1/4 left-1/2 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(217,173,50,0.12),transparent_60%)]" />

      <div className="container-mx flex min-h-[100svh] flex-col justify-center pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="animate-fade-up opacity-0 [animation-delay:100ms]">
            <Logo height={52} />
          </div>

          <div className="mt-6 animate-fade-up opacity-0 [animation-delay:200ms]">
            <span className="eyebrow">
              <span className="h-px w-6 bg-gold-500/60" />
              Cinematic Video Editor
            </span>
          </div>

          <h1
            className="mt-6 animate-fade-up font-display text-5xl font-bold leading-[0.95] tracking-tight text-white opacity-0 [animation-delay:380ms] sm:text-7xl lg:text-8xl"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.7)' }}
          >
            GOWTHAM
            <br />
            <span className="shimmer-text">EDITS</span>
          </h1>

          <p
            className="mt-6 max-w-xl font-serif text-xl italic text-gold-100 opacity-0 animate-fade-up [animation-delay:560ms] sm:text-2xl"
          >
            Turning Moments Into Cinematic Memories
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-300 opacity-0 animate-fade-up [animation-delay:720ms] sm:text-lg">
            Film-grade wedding films, haldi highlights, bike cinematic edits, reels, and
            social content — crafted with rhythm, mood, and color that feels alive.
          </p>

          <div className="mt-9 flex flex-col gap-3 opacity-0 animate-fade-up [animation-delay:880ms] sm:flex-row sm:items-center">
            <a href="#portfolio" className="btn-primary group">
              <span>View Portfolio</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="btn-ghost group">
              <span>Contact Now</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          <a
            href="#portfolio"
            className="mt-10 inline-flex items-center gap-3 text-sm font-medium text-stone-400 opacity-0 animate-fade-up [animation-delay:1040ms] transition-colors hover:text-gold-100"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-500/40 bg-gold-500/5 text-gold-200 transition-all hover:border-gold-400 hover:bg-gold-500/15">
              <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
            </span>
            <span>
              Watch showreel
              <span className="block text-xs text-stone-500">Featured work — 2024</span>
            </span>
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 opacity-0 animate-fade-up [animation-delay:1200ms] sm:mt-24">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={i !== stats.length - 1 ? 'border-r border-white/10 pr-3' : ''}
            >
              <Stat value={s.value} label={s.label} suffix={s.suffix} />
            </div>
          ))}
        </div>

        <div className="mt-12 hidden items-center gap-4 text-stone-500 opacity-0 animate-fade-in [animation-delay:1400ms] sm:flex">
          <Clapperboard className="h-4 w-4 text-gold-500/60" />
          <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-gold-500/30 to-transparent" />
          <span className="text-xs uppercase tracking-[0.3em]">
            Real footage • Real films • Real emotion
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-stone-500 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-gold-500/60 to-transparent" />
      </div>
    </section>
  );
}
