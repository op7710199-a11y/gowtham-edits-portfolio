import { useEffect, useMemo, useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import type { PortfolioItem } from '../../types/database';

const ALL_CATEGORIES = [
  'Wedding Films', 'Cinematic Reels', 'YouTube Videos', 'Commercial Ads',
  'Social Media Content', 'Music Videos',
  'Wedding', 'Haldi', 'Pre-Wedding', 'Bike Shoots', 'Reels', 'Cinematic Edits',
];

interface Props {
  portfolio: PortfolioItem[];
  externalActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
}

export function Portfolio({ portfolio, externalActiveId, onActiveIdChange }: Props) {
  const items = Array.isArray(portfolio) ? portfolio : [];
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (externalActiveId !== undefined) setActiveId(externalActiveId);
  }, [externalActiveId]);

  const selectProject = (id: string | null) => {
    setActiveId(id);
    onActiveIdChange?.(id);
  };

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selectProject(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [activeId]);

  const presentCategories = useMemo(() => {
    const cats = new Set(items.map((p) => p.category).filter(Boolean));
    return ['All', ...ALL_CATEGORIES.filter((c) => cats.has(c)), ...Array.from(cats).filter((c) => !ALL_CATEGORIES.includes(c))];
  }, [items]);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? items : items.filter((p) => p.category === activeCategory)),
    [activeCategory, items]
  );

  const activeProject = activeId ? items.find((p) => p.id === activeId) : null;

  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute right-1/4 top-0 -z-10 h-[45vh] w-[45vh] rounded-full bg-gold-500/8 blur-[110px]" />
      
      <div className="container-mx">
        <SectionHeading
          eyebrow="PORTFOLIO"
          title={<>Featured <span className="text-gradient-gold">Masterpieces</span></>}
          subtitle="A collection of cinematic stories crafted with creativity, emotion and luxury editing."
        />

        {/* Category filters */}
        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {presentCategories.map((f) => (
              <button key={f} type="button" onClick={() => setActiveCategory(f)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === f
                    ? 'bg-gold-gradient text-black shadow-gold'
                    : 'border border-white/10 bg-white/[0.03] text-stone-300 hover:border-gold-500/40 hover:text-gold-100'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Portfolio Gallery */}
        <RevealScope className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filtered.map((p, i) => (
            <Reveal key={p.id ?? i} delay={(i % 2) * 100}>
              <button
                type="button"
                onClick={() => selectProject(p.id)}
                className="group relative overflow-hidden rounded-[32px] border border-gold-500/20 bg-black transition-all duration-700 hover:-translate-y-3 hover:border-gold-400 hover:shadow-[0_0_70px_rgba(198,146,33,0.25)] w-full text-left"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={p.thumbnail_url || ''}
                    alt={p.title ?? ''}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                
                <div className="p-8">
                  <span className="inline-flex rounded-full bg-gold-gradient px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-black">
                    {p.category}
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-bold text-white leading-tight">{p.title ?? ''}</h3>
                  
                  <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-black/50 px-6 py-3 text-gold-300 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-black">
                    View Project <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </RevealScope>
      </div>

      {/* ── Lightbox ── */}
      {activeProject && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => selectProject(null)} />
          <div className="relative z-10 w-full max-w-5xl rounded-[32px] border border-gold-500/20 bg-ink-900 p-2 shadow-2xl">
            <button type="button" onClick={() => selectProject(null)} className="absolute -right-4 -top-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-black shadow-gold hover:scale-105 transition-transform">
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative aspect-video overflow-hidden rounded-[24px] bg-black">
              {activeProject.video_url ? (
                <video src={activeProject.video_url} controls autoPlay className="h-full w-full" poster={activeProject.thumbnail_url || ''} />
              ) : (
                <img src={activeProject.thumbnail_url || ''} alt={activeProject.title ?? ''} className="h-full w-full object-cover" />
              )}
            </div>
            
            <div className="p-8">
              <h3 className="font-display text-3xl font-bold text-white">{activeProject.title}</h3>
              <p className="mt-2 text-stone-400">{activeProject.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
