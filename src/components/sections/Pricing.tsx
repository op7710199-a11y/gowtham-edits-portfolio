import { useState } from 'react';
import { Star, Truck, ArrowUpRight, LayoutList, CreditCard } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import type { PricingTier } from '../../types/database';

interface Props { pricing: PricingTier[]; }

type ViewMode = 'cards' | 'table';

export function Pricing({ pricing }: Props) {
  const [mode, setMode] = useState<ViewMode>('cards');
  const items = Array.isArray(pricing) ? pricing : [];

  if (items.length === 0) return null;
  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[45vh] w-[45vh] rounded-full bg-gold-500/10 blur-[110px]" />
      
      <div className="container-mx">
        <SectionHeading
          eyebrow="PRICING"
          title={<>Choose Your <span className="text-gradient-gold">Editing Package</span></>}
          subtitle="Transparent pricing with premium quality, fast delivery and cinematic storytelling."
        />

        {/* View toggle */}
        <Reveal className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-black/40 p-1">
            <button type="button" onClick={() => setMode('cards')}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${mode === 'cards' ? 'bg-gold-gradient text-black' : 'text-stone-400 hover:text-white'}`}>
              <CreditCard className="h-4 w-4" /> Cards
            </button>
            <button type="button" onClick={() => setMode('table')}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${mode === 'table' ? 'bg-gold-gradient text-black' : 'text-stone-400 hover:text-white'}`}>
              <LayoutList className="h-4 w-4" /> Compare
            </button>
          </div>
        </Reveal>

        {mode === 'cards' ? (
          <RevealScope className="mt-20 grid gap-8 lg:grid-cols-3">
            {items.map((tier, i) => (
              <Reveal key={tier.id ?? i} delay={i * 120} as="article">
                <div className="group relative overflow-hidden rounded-[32px] border border-gold-500/20 bg-gradient-to-b from-ink-900 to-black p-8 transition-all duration-700 hover:-translate-y-3 hover:border-gold-400 hover:shadow-[0_0_70px_rgba(198,146,33,0.25)] h-full">
                  {/* Gold top border */}
                  <div className="absolute left-0 top-0 h-1 w-full bg-gold-gradient" />
                  
                  {tier.is_popular && (
                    <span className="absolute right-6 top-6 rounded-full bg-gold-gradient px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                      MOST POPULAR
                    </span>
                  )}
                  
                  <h3 className="font-display text-2xl font-bold text-white">{tier.name ?? ''}</h3>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl lg:text-6xl font-display font-bold text-white"><span className="text-gold-400">₹</span>{tier.price_label?.replace('₹', '') ?? ''}</span>
                    <span className="text-sm text-stone-400">/ {tier.period ?? ''}</span>
                  </div>
                  
                  <p className="mt-4 text-sm text-stone-400">{tier.description ?? ''}</p>
                  
                  <ul className="mt-8 space-y-4 border-t border-white/[0.08] pt-8">
                    {(tier.features ?? []).map((h) => (
                      <li key={h} className="flex items-center gap-3 text-sm text-stone-200">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-black text-xs font-bold">✓</div>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.delivery_note && (
                    <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
                      <Truck className="h-5 w-5 text-gold-300" />
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500">Delivery</div>
                        <div className="text-xs font-medium text-stone-200">{tier.delivery_note}</div>
                      </div>
                    </div>
                  )}
                  
                  <a href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold-gradient py-4 text-base font-bold text-black transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(198,146,33,0.45)]">
                    Book This Package
                  </a>
                </div>
              </Reveal>
            ))}
          </RevealScope>
        ) : (
          /* Simplified Comparison view */
          <Reveal className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-4 text-left text-stone-400">Feature</th>
                  {items.map(t => <th key={t.id} className="p-4 text-gold-300">{t.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {Array.from(new Set(items.flatMap(t => t.features ?? []))).map(f => (
                  <tr key={f}>
                    <td className="p-4 text-stone-300">{f}</td>
                    {items.map(t => (
                      <td key={t.id} className="p-4 text-center">{t.features?.includes(f) ? '✓' : '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        )}

        <Reveal className="mt-12 text-center">
          <p className="text-sm text-stone-500">Prices are indicative. Final quotes depend on footage length, complexity, and turnaround.</p>
        </Reveal>
      </div>
    </section>
  );
      }
