import { Play, CheckCircle2 } from 'lucide-react';
import { useCountUp } from '../../hooks';
import { useHeroSettings } from '../../hooks/useSupabaseQueries';
import { Logo } from '../Logo';

function StatCounter({
  value,
  label,
  suffix,
}: {
  value: number;
  label: string;
  suffix: string;
}) {
  const { ref, value: v } = useCountUp(value, 2000);

  return (
    <div className="text-center px-3">
      <div className="font-display text-3xl font-bold text-white sm:text-4xl">
        <span ref={ref}>{v}</span>
        <span className="text-gradient-gold">{suffix}</span>
      </div>

      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </div>
    </div>
  );
}

export function Hero() {
  const { loading: heroLoading } = useHeroSettings();

  if (heroLoading) return null;

  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] flex flex-col justify-center overflow-hidden pt-32 pb-20"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(5,8,20,0.70) 0%, rgba(5,8,20,0.50) 40%, rgba(5,8,20,0.25) 100%), url('/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blue Glow */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[180px] animate-pulse" />

      {/* Gold Glow */}
      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-yellow-400/15 blur-[180px] animate-pulse" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container-mx grid items-center gap-16 lg:grid-cols-2">
        <div className="max-w-2xl">

          <Logo height={70} className="mb-8" />

          <h1 className="font-display text-5xl md:text-7xl lg:text-[5rem] leading-[0.9] font-bold text-white">
            Crafting
            <br />
            Cinematic
            <br />
            <span className="text-gradient-gold">
              Stories
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl leading-relaxed text-stone-300 max-w-xl">
            Professional video editing that transforms your footage into unforgettable cinematic experiences with premium storytelling.
          </p>

          {/* Badges */}

          <div className="mt-8 flex flex-wrap gap-4">

            {[
              "100+ Projects Delivered",
              "5+ Years Experience",
              "Fast Delivery",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-300 backdrop-blur-md"
              >
                <CheckCircle2 size={14} />
                {item}
              </div>
            ))}

          </div>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap gap-5">

            <a
              href="#contact"
              className="rounded-full bg-gold-gradient px-10 py-4 font-bold text-black shadow-[0_0_40px_rgba(234,179,8,.35)] transition hover:scale-105"
            >
              Get Free Quote
            </a>

            <a
              href="#portfolio"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-10 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <Play className="fill-white" size={18} />
              Watch Showreel
            </a>

          </div>

          {/* Stats */}

          <div className="mt-16 grid grid-cols-4 gap-4 border-t border-white/10 pt-8">

            <StatCounter
              value={25}
              label="Projects"
              suffix="+"
            />

            <StatCounter
              value={20}
              label="Happy Clients"
              suffix="+"
            />

            <StatCounter
              value={2}
              label="Years"
              suffix="+"
            />

          </div>

        </div>

      </div>

      {/* Scroll */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 text-xs uppercase tracking-[0.35em]">
        Scroll
      </div>

    </section>
  );
}
