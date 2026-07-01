import { Play, CheckCircle2 } from 'lucide-react';
import { useCountUp } from '../../hooks';
import { useHeroSettings } from '../../hooks/useSupabaseQueries';
import { Logo } from '../Logo';

function StatCounter({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { ref, value: v } = useCountUp(value, 2000);
  return (
    <div className="text-center px-3">
      <div className="font-display text-3xl font-bold text-white sm:text-4xl">
        <span ref={ref}>{v}</span>
        <span className="text-gradient-gold">{suffix}</span>
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-stone-400">{label}</div>
    </div>
  );
}

export function Hero() {
  const { loading: heroLoading } = useHeroSettings();

  if (heroLoading) return null;

  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] flex flex-col justify-center overflow-hidden pt-32 pb-20 bg-cover bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url('/hero-bg.png')",
        backgroundPosition: "80% center",
      }}
    >
      {/* Premium Blur Layer */}
      <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none" />

      {/* Decorative Depth Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.12),transparent_45%)] pointer-events-none" />

      <div className="container-mx grid items-center gap-16 lg:grid-cols-2">
        <div className="max-w-2xl relative z-10">
          <Logo height={70} className="mb-8" />
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5rem] leading-[0.9] font-bold text-white">
            Crafting Cinematic <span className="text-gradient-gold relative">Stories</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl leading-relaxed text-stone-300">
            Professional video editing that transforms your footage into unforgettable visual experiences.
          </p>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap gap-4">
            {['100+ Projects Delivered', '5+ Years Experience', 'Fast Delivery'].map((text) => (
              <div key={text} className="flex items-center gap-1.5 text-xs font-medium text-gold-400 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" /> {text}
              </div>
            ))}
          </div>

          {/* Dual CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gold-gradient px-8 py-4 text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(198,146,33,0.4)] transition-all">
              Get Free Quote
            </a>
            <a href="#portfolio" className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-white/10 px-8 py-4 text-white font-semibold rounded-full hover:bg-white/5 transition-all">
              <Play className="h-4 w-4 fill-white" /> Watch Showreel
            </a>
          </div>

          {/* Stats Counters */}
          <div className="mt-12 grid grid-cols-4 gap-4 border-t border-white/10 pt-8">
            <StatCounter value={100} label="Projects" suffix="+" />
            <StatCounter value={50} label="Happy Clients" suffix="+" />
            <StatCounter value={5} label="Years" suffix="+" />
            <StatCounter value={24} label="Fast Delivery" suffix="h" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-stone-500 text-xs uppercase tracking-widest flex flex-col items-center gap-2 z-10">
        Scroll to Explore ↓
      </div>
    </section>
  );
}
