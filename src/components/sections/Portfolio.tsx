import { useEffect, useMemo, useState } from 'react';
import { Play, X, ArrowUpLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, REEL_FEED } from '../../data/content';
import type { PortfolioItem } from '../../types/database';

const ALL_CATEGORIES = ['Wedding', 'Haldi', 'Pre-Wedding', 'Bike Shoots', 'Reels', 'Cinematic Edits', 'Social Media Content'];

interface Props {
  portfolio: PortfolioItem[];
  externalActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
}

export function Portfolio({ portfolio, externalActiveId, onActiveIdChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
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
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const presentCategories = useMemo(() => {
    const cats = new Set(portfolio.map((p) => p.category));
    return ['All', ...ALL_CATEGORIES.filter((c) => cats.has(c))];
  }, [portfolio]);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? portfolio : portfolio.filter((p) => p.category === activeCategory)),
    [activeCategory, portfolio]
  );

  const activeIndex = useMemo(() => filtered.findIndex((p) => p.id === activeId), [activeId, filtered]);
  const step = (dir: number) => {
    if (!filtered.length) return;
    const next = (activeIndex + dir + filtered.length) % filtered.length;
    selectProject(filtered[next].id);
  };
  const activeProject = activeId ? portfolio.find((p) => p.id === activeId) : null;

  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute right-1/4 top-10 -z-10 h-[40vh] w-[40vh] rounded-full bg-gold-500/8 blur-[110px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="Portfolio"
          title={<>Selected <span className="text-gradient-gold">work</span></>}
          subtitle="Filter by category and tap any project to preview. Every film is a unique collaboration — yours could be next."
        />
        <Reveal className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {presentCategories.map((f) => (
              <button key={f} type="button" onClick={() => setActiveCategory(f)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm ${
                  activeCategory === f ? 'bg-gold-gradient text-ink-950 shadow-gold' : 'border border-white/10 bg-white/[0.03] text-stone-300 hover:border-gold-500/40 hover:text-gold-100'
                }`}>{f}</button>
            ))}
          </div>
        </Reveal>

        <RevealScope className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 80} as="article">
              <button type="button" onClick={() => selectProject(p.id)} className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.06] text-left">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={p.thumbnail_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 scale-90 place-items-center rounded-full border border-white/30 bg-white/10 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                      <Play className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold-300">{p.category}</span>
                    <h3 className="mt-1 font-display text-base font-semibold text-white">{p.title}</h3>
                  </div>
                  {p.is_featured && (
                    <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-950">Featured</span>
                  )}
                </div>
              </button>
            </Reveal>
          ))}
        </RevealScope>

        <Reveal className="mt-16">
          <div className="glass-gold overflow-hidden rounded-3xl p-7 sm:p-9">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="eyebrow"><span className="h-px w-6 bg-gold-500/60" />@ {INSTAGRAM_HANDLE}</span>
                <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Latest reels on Instagram</h3>
              </div>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost"><ArrowUpLeft className="h-4 w-4" /> Follow on Instagram</a>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
              {REEL_FEED.map((r) => (
                <a key={r.id} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[3/4] overflow-hidden rounded-xl">
                  <img src={r.image} alt={r.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
                  <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md"><Play className="h-4 w-4 translate-x-0.5 text-white" fill="currentColor" /></span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2.5"><span className="line-clamp-1 text-[11px] font-medium text-white/90">{r.caption}</span></div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {activeProject && (
        <div role="dialog" aria-modal="true" aria-label={`Preview: ${activeProject.title}`} className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-md animate-fade-in" onClick={() => selectProject(null)} />
          <div className="relative z-10 w-full max-w-4xl animate-scale-in">
            <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-ink-900 shadow-gold">
              <button type="button" onClick={() => selectProject(null)} aria-label="Close preview" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-ink-950/70 text-white backdrop-blur-md transition-colors hover:bg-gold-500 hover:text-ink-950"><X className="h-5 w-5" /></button>
              <div className="relative aspect-video">
                <img src={activeProject.thumbnail_url} alt={activeProject.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-ink-950/30">
                  <button type="button" className="group grid h-20 w-20 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-all hover:scale-110 hover:bg-gold-gradient hover:border-transparent"><Play className="h-8 w-8 translate-x-0.5 text-white transition-colors group-hover:text-ink-950" fill="currentColor" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-gold-300">{activeProject.category}</span>
                  <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{activeProject.title}</h3>
                  {activeProject.description && <p className="mt-1 text-sm text-stone-400">{activeProject.description}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-stone-200 transition-colors hover:border-gold-500/40 hover:text-gold-100"><ChevronLeft className="h-5 w-5" /></button>
                  <button type="button" onClick={() => step(1)} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-stone-200 transition-colors hover:border-gold-500/40 hover:text-gold-100"><ChevronRight className="h-5 w-5" /></button>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center text-xs text-stone-500">{activeIndex + 1} / {filtered.length} · Press ESC to close, ← → to navigate</div>
          </div>
        </div>
      )}
    </section>
  );
}
