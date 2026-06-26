import { ArrowUpRight, CheckCircle2, Clock, Users, Target } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { Icon } from '../Icon';
import type { Service } from '../../types/database';
import type { IconName } from '../../data/content';

interface Props { services: Service[]; }

export function Services({ services }: Props) {
  const items = Array.isArray(services) ? services : [];
  if (items.length === 0) return null;
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-gold-500/8 blur-[120px]" />
      
      <div className="container-mx">
        <SectionHeading
          eyebrow="PREMIUM SERVICES"
          title={
            <>
              Luxury <span className="text-gradient-gold">Editing Services</span>
            </>
          }
          subtitle="Professional cinematic editing crafted for weddings, brands, creators and unforgettable stories."
        />
        
        <RevealScope className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.id ?? i} delay={(i % 3) * 90} as="article">
              <div className="group relative overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-b from-ink-900 to-black p-8 transition-all duration-700 hover:-translate-y-3 hover:border-gold-400 hover:shadow-[0_0_60px_rgba(198,146,33,0.25)]">
                {/* Gold accent line */}
                <div className="mb-6 h-1 w-16 rounded-full bg-gold-gradient" />
                
                <div className="flex items-center justify-between">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-gold-500/10 text-gold-300 transition-all duration-500 group-hover:bg-gold-gradient group-hover:text-ink-950">
                    <Icon name={(s.icon ?? 'Film') as IconName} className="h-10 w-10" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-stone-500 opacity-0 transition-all duration-500 group-hover:text-gold-300 group-hover:opacity-100" />
                </div>
                
                <h3 className="mt-8 font-display text-2xl font-bold text-white">{s.title ?? ''}</h3>
                <p className="mt-4 text-base leading-8 text-stone-400">{s.description ?? ''}</p>
                
                <ul className="mt-6 space-y-3">
                  {(s.features ?? []).map((item, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-stone-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-stone-500"><Users className="h-3 w-3" /> Ideal for</div>
                    <div className="mt-1 text-xs font-medium text-stone-200">{s.ideal_for ?? '—'}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-stone-500"><Clock className="h-3 w-3" /> Delivery</div>
                    <div className="mt-1 text-xs font-medium text-gold-200">{s.delivery_time ?? '—'}</div>
                  </div>
                </div>
                
                <a href="#contact" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/[0.05] py-4 text-sm font-semibold text-gold-100 transition-all duration-500 hover:border-gold-400 hover:bg-gold-500 hover:text-black active:scale-95">
                  <Target className="h-4 w-4" /> Book This Service
                </a>
              </div>
            </Reveal>
          ))}
        </RevealScope>
      </div>
    </section>
  );
}
