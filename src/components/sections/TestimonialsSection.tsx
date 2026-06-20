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
  const [current, setCurrent] = useState(0);
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;

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

  if (testimonials.length === 0) return null;

  const active = testimonials[current];

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[60vh] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[120px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="Client Love"
          title={<>Stories from <span className="text-gradient-gold">happy clients</span></>}
          subtitle="Real reviews, real results — from couples, creators, and riders."
        />

        {/* ── Main carousel ── */}
        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-white/[0.03] p-8 sm:p-12">
            {/* Background quote mark */}
            <Quote className="absolute right-8 top-8 h-24 w-24 text-gold-500/5" fill="currentColor" strokeWidth={0} />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                {/* Stars */}
                <div className="flex gap-1" aria-label={`${active.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < active.rating ? 'text-gold-400' : 'text-stone-700'}`}
                      fill={i < active.rating ? 'currentColor' : 'none'} strokeWidth={i < active.rating ? 0 : 1.5} />
                  ))}
                </div>
                {/* Quote */}
                <blockquote className="mt-5 font-serif text-xl italic leading-relaxed text-stone-100 sm:text-2xl">
                  "{active.content}"
                </blockquote>
                {/* Client */}
                <div className="mt-6 flex items-center gap-4">
                  {active.avatar_url ? (
                    <img src={active.avatar_url} alt={active.client_name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-500/40" />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-xl font-bold text-ink-950">
                      {active.client_name[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-display text-lg font-bold text-white">{active.client_name}</div>
                    <div className="text-sm text-stone-400">{active.client_role ?? ''}</div>
                  </div>
                </div>
              </div>

              {/* Video testimonial thumbnail */}
              <div className="shrink-0 lg:w-52">
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-ink-900 border border-white/10 cursor-pointer group"
                  onClick={() => active.avatar_url && setVideoOpen(active.avatar_url)}>
                  <img src={active.avatar_url ?? ''} alt="" className="h-full w-full object-cover opacity-50" />
                  <div className="absolute inset-0 grid place-items-center bg-ink-950/50">
                    <div className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md group-hover:bg-gold-gradient group-hover:border-transparent transition-all duration-300">
                      <Play className="h-5 w-5 translate-x-0.5 text-white group-hover:text-ink-950" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 inset-x-0 text-center text-[10px] font-semibold uppercase tracking-widest text-white/70">
                    Video Review
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} type="button" onClick={() => { setCurrent(i); if (autoRef.current) clearInterval(autoRef.current); }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-gold-gradient' : 'w-1.5 bg-stone-700 hover:bg-stone-500'}`} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => go(-1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-stone-300 hover:border-gold-500/40 hover:text-gold-100 transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => go(1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-stone-300 hover:border-gold-500/40 hover:text-gold-100 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Mini cards ── */}
        {testimonials.length > 1 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <button type="button" onClick={() => { setCurrent(i); if (autoRef.current) clearInterval(autoRef.current); }}
                  className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                    i === current ? 'border-gold-500/30 bg-gold-500/[0.06]' : 'border-white/[0.06] bg-white/[0.02] hover:border-gold-500/20'
                  }`}>
                  <div className="flex gap-0.5 text-gold-400">
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-stone-300">"{t.content}"</p>
                  <div className="mt-3 flex items-center gap-2">
                    {t.avatar_url && <img src={t.avatar_url} alt={t.client_name} className="h-7 w-7 rounded-full object-cover ring-1 ring-gold-500/30" />}
                    <span className="text-xs font-semibold text-white">{t.client_name}</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}

        {/* ── Impact metrics ── */}
        <Reveal className="mt-10">
          <div className="glass-gold rounded-2xl p-7 sm:p-9">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Impact</span>
                <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Before &amp; after the edit</h3>
              </div>
              <p className="max-w-sm text-sm text-stone-400">Measurable lift clients see after the cinematic treatment.</p>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {IMPACT.map((item) => (
                <Reveal key={item.label}>
                  <div className="rounded-xl border border-white/[0.06] bg-ink-900/50 p-6">
                    <item.icon className="h-6 w-6 text-gold-300" />
                    <div className="mt-4 font-display text-3xl font-bold text-gradient-gold sm:text-4xl">{item.metric}</div>
                    <div className="mt-1 text-sm font-semibold text-white">{item.label}</div>
                    <div className="mt-0.5 text-xs text-stone-500">{item.note}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Video modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ink-950/95 backdrop-blur-xl p-4" onClick={() => setVideoOpen(null)}>
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setVideoOpen(null)}
              className="absolute -right-4 -top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink-900 text-white hover:bg-gold-500 hover:text-ink-950 transition-colors">
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </button>
            <div className="overflow-hidden rounded-2xl bg-ink-900 aspect-[9/16]">
              <div className="grid h-full place-items-center text-stone-400 text-sm">Video testimonial coming soon</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
