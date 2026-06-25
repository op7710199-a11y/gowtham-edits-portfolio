import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import type { PortfolioItem } from '../../types/database';

const ALL_CATEGORIES = [
  'Wedding Films', 'Cinematic Reels', 'YouTube Videos', 'Commercial Ads',
  'Social Media Content', 'Music Videos',
  // Legacy categories
  'Wedding', 'Haldi', 'Pre-Wedding', 'Bike Shoots', 'Reels', 'Cinematic Edits',
];

interface Props {
  portfolio: PortfolioItem[];
  externalActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
}

// ── Before/After Slider ──────────────────────────────────────
function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  return (
    <div
      ref={trackRef}
      className="relative h-48 select-none overflow-hidden rounded-xl cursor-col-resize"
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <img src={after} alt="After" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 h-full w-full object-cover" style={{ width: '100vw' }} />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-ink-900 shadow-xl">
          <ChevronLeft className="absolute right-4 h-3 w-3 text-white" />
          <ChevronRight className="absolute left-4 h-3 w-3 text-white" />
        </div>
      </div>
      <span className="absolute left-2 top-2 rounded bg-ink-950/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">Before</span>
      <span className="absolute right-2 top-2 rounded bg-gold-500/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-950 backdrop-blur-sm">After</span>
    </div>
  );
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
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const presentCategories = useMemo(() => {
    const cats = new Set(items.map((p) => p.category).filter(Boolean));
    return ['All', ...ALL_CATEGORIES.filter((c) => cats.has(c)), ...Array.from(cats).filter((c) => !ALL_CATEGORIES.includes(c))];
  }, [items]);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? items : items.filter((p) => p.category === activeCategory)),
    [activeCategory, items]
  );

  const activeIndex = useMemo(() => filtered.findIndex((p) => p.id === activeId), [activeId, filtered]);
  const step = (dir: number) => {
    if (!filtered.length) return;
    selectProject(filtered[(activeIndex + dir + filtered.length) % filtered.length].id);
  };
  const activeProject = activeId ? items.find((p) => p.id === activeId) : null;

  return (
    <section id="portfolio" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute right-1/4 top-0 -z-10 h-[45vh] w-[45vh] rounded-full bg-gold-500/8 blur-[110px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="Portfolio"
          title={<>Selected <span className="text-gradient-gold">work</span></>}
          subtitle="Filter by category and tap any project to preview. Every film is a unique collaboration."
        />

        {/* Category filters */}
        <Reveal className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {presentCategories.map((f) => (
              <button key={f} type="button" onClick={() => setActiveCategory(f)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 sm:text-sm ${
                  activeCategory === f
                    ? 'bg-gold-gradient text-ink-950 shadow-gold'
                    : 'border border-white/10 bg-white/[0.03] text-stone-300 hover:border-gold-500/40 hover:text-gold-100'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Masonry-style gallery */}
        <RevealScope className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id ?? i} delay={(i % 3) * 80}>
              <button
                type="button"
                onClick={() => selectProject(p.id)}
                className={`group relative mb-4 block w-full overflow-hidden rounded-2xl border border-white/[0.06] text-left ${
                  i % 5 === 0 || i % 5 === 3 ? 'aspect-[3/4]' : 'aspect-video'
                }`}
              >
                <img
                  src={p.thumbnail_url || ''}
                  alt={p.title ?? ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                {/* Play button */}
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 scale-90 place-items-center rounded-full border border-white/30 bg-white/10 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <Play className="h-5 w-5 translate-x-0.5 text-white" fill="currentColor" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">{p.category ?? ''}</span>
                  <h3 className="mt-1 font-display text-base font-semibold text-white leading-snug">{p.title ?? ''}</h3>
                </div>
                {p.is_featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-gold-gradient px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-ink-950">
                    Featured
                  </span>
                )}
                <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ink-950/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </RevealScope>
      </div>

      {/* ── Lightbox ── */}
      {activeProject && (
        <div role="dialog" aria-modal="true" aria-label={`Preview: ${activeProject.title ?? 'Project'}`}
          className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-xl animate-fade-in" onClick={() => selectProject(null)} />
          <div className="relative z-10 w-full max-w-4xl animate-scale-in">
            <div className="overflow-hidden rounded-2xl border border-gold-500/20 bg-ink-900 shadow-gold">
              <button
                type="button"
                onClick={() => selectProject(null)}
                className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-ink-950/70 text-white backdrop-blur-md hover:bg-gold-500 hover:text-ink-950 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Before/After or Video */}
              {activeProject.video_url ? (
                <div className="relative aspect-video bg-ink-950">
                  <video
                    src={activeProject.video_url}
                    controls
                    autoPlay
                    className="h-full w-full"
                    poster={activeProject.thumbnail_url || ''}
                  />
                </div>
              ) : (
                <div className="relative aspect-video">
                  <img src={activeProject.thumbnail_url || ''} alt={activeProject.title ?? ''} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 grid place-items-center bg-ink-950/30">
                    <div className="grid h-20 w-20 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md">
                      <Play className="h-8 w-8 translate-x-0.5 text-white" fill="currentColor" />
                    </div>
                  </div>
                </div>
              )}

              {/* Before/After demo */}
              {(activeProject.description ?? '').includes('before:') && (
                <div className="p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-400">Before / After</p>
                  <BeforeAfterSlider
                    before={activeProject.thumbnail_url || ''}
                    after={activeProject.thumbnail_url || ''}
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">{activeProject.category ?? ''}</span>
                  <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{activeProject.title ?? ''}</h3>
                  {activeProject.description && (
                    <p className="mt-1 text-sm text-stone-400 line-clamp-2">{activeProject.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-stone-200 hover:border-gold-500/40 hover:text-gold-100 transition-colors">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-stone-200 hover:border-gold-500/40 hover:text-gold-100 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center text-xs text-stone-500">
              {activeIndex + 1} / {filtered.length} · ESC to close · ← → to navigate
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
