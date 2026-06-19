import { ArrowUpRight, Play } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import type { PortfolioItem } from '../../types/database';

interface Props {
  portfolio: PortfolioItem[];
  onOpenProject: (id: string) => void;
}

export function FeaturedProjects({ portfolio, onOpenProject }: Props) {
  const featured = portfolio.filter((p) => p.is_featured).slice(0, 4);
  return (
    <section id="featured" className="section-padding relative">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-[100px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="Featured Work"
          title={<>Films that <span className="text-gradient-gold">move people</span></>}
          subtitle="A glimpse of recent cinematic edits across weddings, haldi, and high-energy bike films."
        />
        <RevealScope className="mt-14 grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 100} as="article">
              <button type="button" onClick={() => onOpenProject(p.id)} className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.06] text-left">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.thumbnail_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid h-16 w-16 scale-90 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md opacity-0 transition-all duration-500 ease-cinematic group-hover:scale-100 group-hover:opacity-100">
                      <Play className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-gold-300">{p.category}</span>
                    <h3 className="mt-1.5 font-display text-xl font-semibold text-white">{p.title}</h3>
                  </div>
                  <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink-950/60 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </RevealScope>
        <Reveal className="mt-10 text-center">
          <a href="#portfolio" className="btn-primary">View full portfolio <ArrowUpRight className="h-4 w-4" /></a>
        </Reveal>
      </div>
    </section>
  );
}
