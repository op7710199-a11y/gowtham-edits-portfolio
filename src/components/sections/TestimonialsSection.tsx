import { Star, TrendingUp, Eye, Clock4 } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import type { Testimonial } from '../../types/database';

const IMPACT = [
  { icon: TrendingUp, metric: '3.2x', label: 'Avg. reel reach lift', note: 'After swapping to cine-cut pacing' },
  { icon: Eye, metric: '+58%', label: 'Watch-time retention', note: 'On YouTube edits' },
  { icon: Clock4, metric: '48hrs', label: 'Fastest reel turn-around', note: 'Standard service' },
];

interface Props { testimonials: Testimonial[]; }

export function TestimonialsSection({ testimonials }: Props) {
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[60vh] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[120px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="Client Love"
          title={<>Stories from <span className="text-gradient-gold">happy clients</span></>}
          subtitle="Real reviews, real results. Here's what couples, creators, and riders say after the cut."
        />
        <RevealScope className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 90} as="article">
              <figure className="card-glass group h-full p-6 hover:border-gold-500/30 hover:bg-white/[0.06]">
                <div className="flex items-center gap-1 text-gold-300" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, idx) => (<Star key={idx} className="h-4 w-4" fill="currentColor" strokeWidth={0} />))}
                </div>
                <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-stone-200">"{t.content}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.client_name} loading="lazy" className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-500/30" />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-500/10 text-lg font-bold text-gold-300 ring-2 ring-gold-500/20">{t.client_name[0]}</div>
                  )}
                  <div><div className="text-sm font-semibold text-white">{t.client_name}</div><div className="text-xs text-stone-400">{t.client_role ?? ''}</div></div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </RevealScope>

        <Reveal className="mt-10">
          <div className="glass-gold rounded-2xl p-7 sm:p-9">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div><span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />Impact</span><h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Before &amp; after the edit</h3></div>
              <p className="max-w-sm text-sm text-stone-400">The same footage, transformed. Here's the measurable lift clients see after the cinematic treatment.</p>
            </div>
            <RevealScope className="mt-8 grid gap-5 sm:grid-cols-3">
              {IMPACT.map((item, i) => (
                <Reveal key={item.label} delay={i * 110}>
                  <div className="relative rounded-xl border border-white/[0.06] bg-ink-900/50 p-6">
                    <item.icon className="h-6 w-6 text-gold-300" />
                    <div className="mt-4 font-display text-3xl font-bold text-gradient-gold sm:text-4xl">{item.metric}</div>
                    <div className="mt-1 text-sm font-semibold text-white">{item.label}</div>
                    <div className="mt-0.5 text-xs text-stone-500">{item.note}</div>
                  </div>
                </Reveal>
              ))}
            </RevealScope>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
