import { ArrowUpRight, Play } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import type { PortfolioItem } from '../../types/database';

interface Props { 
  portfolio: PortfolioItem[]; 
  onOpenProject: (id: string) => void; 
}

export function FeaturedProjects({ portfolio, onOpenProject }: Props) {
  const items = Array.isArray(portfolio) ? portfolio : [];
  const featured = items.filter((p) => p.is_featured).slice(0, 4);
  
  if (featured.length === 0) return null;
  
  return (
    <section id="featured" className="section-padding relative">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-[100px]" />
      
      <div className="container-mx">
        <SectionHeading 
          eyebrow="Featured Work" 
          title={<>Films that <span className="text-gradient-gold">move people</span></>}
          subtitle="A glimpse of recent cinematic edits across weddings, haldi, and high-energy bike films." 
        />
        
        <RevealScope className="mt-16 grid gap-6 lg:grid-cols-12">
          {featured.map((p, i) => (
            <Reveal 
              key={p.id ?? i} 
              delay={i * 100} 
              as="article"
              className={i === 0 ? "lg:col-span-7" : "lg:col-span-5"}
            >
              <button 
                type="button" 
                onClick={() => onOpenProject(p.id)} 
                className="group relative block w-full overflow-hidden rounded-[30px] border border-gold-500/15 bg-white/[0.03] backdrop-blur-xl text-left transition-all duration-700 hover:border-gold-500/40 hover:shadow-[0_0_50px_rgba(198,146,33,0.25)]"
              >
                <div className={`relative overflow-hidden ${i === 0 ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
                  <img 
                    src={p.thumbnail_url || ''} 
                    alt={p.title ?? ''} 
                    loading="lazy" 
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-110" 
                  />
                  
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  {/* Play icon center */}
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid h-16 w-16 scale-90 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md opacity-0 transition-all duration-500 ease-cinematic group-hover:scale-100 group-hover:opacity-100">
                      <Play className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" />
                    </span>
                  </div>
                  
                  {/* Text content */}
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <span className="text-xs font-medium uppercase tracking-[0.25em] text-gold-300">{p.category ?? ''}</span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">{p.title ?? ''}</h3>
                  </div>
                  
                  {/* Top-right arrow */}
                  <span className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </RevealScope>
        
        <Reveal className="mt-16 text-center">
          <a href="#portfolio" className="btn-primary">
            View full portfolio <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
