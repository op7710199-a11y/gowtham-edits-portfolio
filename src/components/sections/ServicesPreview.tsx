import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionHeading, RevealScope } from '../Reveal';
import { Icon } from '../Icon';
import type { Service } from '../../types/database';
import type { IconName } from '../../data/content';

interface Props { services: Service[]; }

export function ServicesPreview({ services }: Props) {
  const preview = services.slice(0, 4);
  return (
    <section id="services-preview" className="section-padding relative">
      <div className="container-mx">
        <SectionHeading
          eyebrow="What I Edit"
          title={<>Services built around <span className="text-gradient-gold">your story</span></>}
          subtitle="From intimate pre-wedding films to high-octane bike cinematics — every edit carries the same cinematic signature."
        />
        <RevealScope className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((s, i) => (
            <Reveal key={s.id} delay={i * 90} as="article">
              <div className="card-glass group h-full p-6 hover:border-gold-500/30 hover:bg-white/[0.06]">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500/10 text-gold-300 transition-colors group-hover:bg-gold-gradient group-hover:text-ink-950"><Icon name={(s.icon ?? 'Film') as IconName} className="h-6 w-6" /></div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">{s.description ?? ''}</p>
                <a href="#services" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold-300 transition-colors hover:text-gold-100">Explore <ArrowUpRight className="h-4 w-4" /></a>
              </div>
            </Reveal>
          ))}
        </RevealScope>
        <Reveal className="mt-10 text-center">
          <a href="#services" className="btn-ghost">View all {services.length} services <ArrowUpRight className="h-4 w-4" /></a>
        </Reveal>
      </div>
    </section>
  );
}
