import { useEffect, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Play, TrendingUp, Eye, Clock4, Quote } from 'lucide-react';
import { Reveal, SectionHeading } from '../Reveal';
import type { Testimonial } from '../../types/database';

const IMPACT = [
  { icon: TrendingUp, metric: '3.2x', label: 'Avg. reel reach lift', note: 'After switching to cine-cut pacing' },
  { icon: Eye, metric: '+58%', label: 'Watch-time retention', note: 'On YouTube edits' },
  { icon: Clock4, metric: '48hrs', label: 'Fastest reel turnaround', note: 'Standard service' },
];

interface Props { testimonials: Testimonial[]; }

export function TestimonialsSection({ testimonials }: Props) {
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];
  const [current, setCurrent] = useState(0);
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = safeTestimonials.length;

  const go = (dir: number) => {
    if (total === 0) return;
    setCurrent((c) => (c + dir + total) % total);
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    if (total <= 1) return;
    autoRef.current = setInterval(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [total]);

  if (safeTestimonials.length === 0) return null;

  const active = safeTestimonials[current];

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[60vh] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />
      
      <div className="container-mx">
        <SectionHeading
          eyebrow="CLIENT REVIEWS"
          title={<>Trusted by <span className="text-gradient-gold">Happy Clients</span></>}
          subtitle="Every project is built on trust, creativity and cinematic storytelling."
        />

        <Reveal className="mt-20">
          <div className="group relative overflow-hidden rounded-[32px] border border-gold-500/20 bg-gradient-to-b from-ink-900 to-black p-8 sm:p-12 transition-all duration-700 hover:border-gold-400 hover:shadow-[0_0_60px_rgba(198,146,33,0.25)]">
            <Quote className="absolute right-6 top-6 h-24 w-24 text-gold-500/10" />
            
            <div className="relative grid gap-12 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-6 flex gap-1 text-gold-400">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg leading-9 text-stone-200 italic">
                  "{active.content ?? ''}"
                </blockquote>
                
                <div className="mt-8">
                  <div className="mb-6 h-1 w-16 rounded-full bg-gold-gradient" />
                  <div className="flex items-center gap-4">
                    {active.avatar_url ? (
                      <img src={active.avatar_url} alt={active.client_name ?? ''} className="h-16 w-16 rounded-full border-2 border-gold-500/40 object-cover" />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient text-xl font-bold text-black">
                        {(active.client_name ?? '?')[0] ?? '?'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-2xl font-display font-bold text-white">{active.client_name ?? 'Anonymous'}</h4>
                      <p className="text-sm text-stone-400">{active.client_role ?? ''}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Thumbnail */}
              <div className="shrink-0 lg:w-56">
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-ink-900 border border-white/10 cursor-pointer group/video"
                  onClick={() => active.avatar_url && setVideoOpen(active.avatar_url)}>
                  <img src={active.avatar_url ?? ''} alt="" className="h-full w-full object-cover opacity-50" />
                  <div className="absolute inset-0 grid place-items-center bg-black/50">
                    <div className="grid h-16 w-16 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md group-hover/video:bg-gold-gradient group-hover/video:border-transparent transition-all duration-300">
                      <Play className="h-6 w-6 translate-x-0.5 text-white group-hover/video:text-black" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {safeTestimonials.map((_, i) => (
                  <button key={i} type="button" onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-gold-gradient' : 'w-1.5 bg-stone-700'}`} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => go(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-stone-300 hover:border-gold-500 hover:text-gold-100 transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => go(1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-stone-300 hover:border-gold-500 hover:text-gold-100 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Impact metrics */}
        <Reveal className="mt-20">
          <div className="rounded-[32px] border border-gold-500/20 bg-white/[0.03] p-8 sm:p-12">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-3xl font-bold text-white">Before & after the edit</h3>
              </div>
              <p className="max-w-sm text-stone-400">Measurable lift clients see after the cinematic treatment.</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {IMPACT.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/[0.06] bg-black p-8">
                  <item.icon className="h-8 w-8 text-gold-400" />
                  <div className="mt-4 font-display text-4xl font-bold text-gradient-gold">{item.metric}</div>
                  <div className="mt-2 font-semibold text-white">{item.label}</div>
                  <div className="mt-1 text-sm text-stone-500">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
