import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Play, Quote, TrendingUp, Eye, Clock4 } from 'lucide-react';
import { Reveal, SectionHeading } from '../Reveal';
import type { Testimonial } from '../../types/database';

const IMPACT = [
  { icon: TrendingUp, metric: '3.2x', label: 'Avg. reel reach lift', note: 'After switching to cine-cut pacing' },
  { icon: Eye, metric: '+58%', label: 'Watch-time retention', note: 'On YouTube edits' },
  { icon: Clock4, metric: '48hrs', label: 'Fastest turnaround', note: 'Standard service' },
];

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const total = testimonials?.length || 0;

  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => clearInterval(interval);
  }, [total]);

  if (!testimonials?.length) return null;

  const active = testimonials[current];

  return (
    <section id="testimonials" className="section-padding relative">
      <div className="container-mx">
        <SectionHeading 
          eyebrow="CLIENT REVIEWS" 
          title={<>Trusted by <span className="text-gradient-gold">Happy Clients</span></>} 
          subtitle="Every project is built on trust, creativity, and cinematic storytelling."
        />

        <Reveal className="mt-20">
          <div className="rounded-[32px] border border-gold-500/20 bg-gradient-to-b from-ink-900 to-black p-8 sm:p-12">
            <Quote className="absolute right-6 top-6 h-24 w-24 text-gold-500/10" />
            
            <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
              <div>
                <div className="flex gap-1 text-gold-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <blockquote className="text-xl leading-9 text-stone-200 italic">"{active.content}"</blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gold-gradient grid place-items-center font-bold text-black">
                     {active.avatar_url ? <img src={active.avatar_url} className="rounded-full" /> : active.client_name[0]}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{active.client_name}</h4>
                    <p className="text-sm text-stone-400">{active.client_role}</p>
                  </div>
                </div>
              </div>

              {/* Video Preview Block */}
              <div className="w-56 aspect-[9/16] rounded-2xl bg-black border border-white/10 flex items-center justify-center">
                 <Play className="text-gold-400" size={48} />
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex justify-between items-center">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`h-1 rounded-full transition-all ${i === current ? 'w-8 bg-gold-gradient' : 'w-4 bg-stone-700'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCurrent((c) => (c - 1 + total) % total)} className="p-3 border border-white/10 rounded-full"><ChevronLeft size={20}/></button>
                <button onClick={() => setCurrent((c) => (c + 1) % total)} className="p-3 border border-white/10 rounded-full"><ChevronRight size={20}/></button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Impact Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {IMPACT.map((item) => (
            <div key={item.label} className="p-8 border border-white/5 bg-white/[0.02] rounded-3xl">
              <item.icon className="text-gold-400 mb-4" />
              <div className="text-4xl font-bold text-white">{item.metric}</div>
              <div className="text-sm font-semibold mt-2">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
