import { useState } from 'react';
import { CheckCircle2, X, Star, Truck, ArrowUpRight, LayoutList, CreditCard } from 'lucide-react';
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
          eyebrow="Pricing"
          title={<>Simple, transparent <span className="text-gradient-gold">packages</span></>}
          subtitle="Starting points for the most-requested edits. Final pricing shaped by your scope — reach out for an exact quote."
        />

        {/* View toggle */}
        <Reveal className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-ink-900/60 p-1">
            <button type="button" onClick={() => setMode('cards')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${mode === 'cards' ? 'bg-gold-gradient text-ink-950' : 'text-stone-400 hover:text-white'}`}>
              <CreditCard className="h-3.5 w-3.5" /> Cards
            </button>
            <button type="button" onClick={() => setMode('table')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${mode === 'table' ? 'bg-gold-gradient text-ink-950' : 'text-stone-400 hover:text-white'}`}>
              <LayoutList className="h-3.5 w-3.5" /> Compare
            </button>
          </div>
        </Reveal>

        {mode === 'cards' ? (
          <RevealScope className="mt-12 grid gap-6 lg:grid-cols-3">
            {items.map((tier, i) => (
              <Reveal key={tier.id ?? i} delay={i * 120} as="article">
                <div className={`relative h-full overflow-hidden rounded-3xl p-7 sm:p-8 transition-all duration-500 hover:-translate-y-1 ${
                  tier.is_popular
                    ? 'glass-gold border-gold-500/40 shadow-gold-glow'
                    : 'card-glass hover:border-gold-500/20 hover:shadow-gold'
                }`}>
                  {tier.is_popular && (
                    <>
                      <div className="pointer-events-none absolute -top-1/3 right-0 -z-10 h-[40vh] w-[40vh] rounded-full bg-gold-500/15 blur-[100px]" />
                      <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-950">
                        <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} /> Most Popular
                      </span>
                    </>
                  )}
                  <h3 className="font-display text-2xl font-bold text-white">{tier.name ?? ''}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-bold text-gradient-gold">{tier.price_label ?? ''}</span>
                    <span className="text-sm text-stone-400">/ {tier.period ?? ''}</span>
                  </div>
                  <p className="mt-3 text-sm text-stone-400">
                    <span className="text-stone-300">Best for:</span> {tier.description ?? ''}
                  </p>
                  <ul className="mt-6 space-y-3 border-t border-white/[0.06] pt-6">
                    {(tier.features ?? []).map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-stone-200">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.delivery_note && (
                    <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-ink-900/40 p-3">
                      <Truck className="h-4 w-4 text-gold-300" />
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500">Delivery</div>
                        <div className="text-xs font-medium text-stone-200">{tier.delivery_note}</div>
                      </div>
                    </div>
                  )}
                  <a href="#contact"
                    className={`mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all active:scale-95 ${
                      tier.is_popular
                        ? 'bg-gold-gradient text-ink-950 shadow-gold hover:shadow-gold-glow hover:scale-[1.02]'
                        : 'border border-gold-500/30 bg-gold-500/[0.05] text-gold-100 hover:border-gold-400 hover:bg-gold-500/15'
                    }`}>
                    Request Quote <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Reveal>
            ))}
          </RevealScope>
        ) : (
          /* Comparison table */
          <Reveal className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="pb-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 pr-6">Feature</th>
                  {pricing.map((tier) => (
                    <th key={tier.id} className="pb-4 text-center">
                      <div className={`inline-flex flex-col items-center gap-1 rounded-2xl px-4 py-3 ${tier.is_popular ? 'bg-gold-gradient text-ink-950' : 'border border-white/10 text-white'}`}>
                        <span className="font-display text-sm font-bold">{tier.name ?? ''}</span>
                        <span className="text-xs opacity-80">{tier.price_label ?? ''}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {/* Collect all unique features */}
                {Array.from(new Set(items.flatMap((t) => t.features ?? []))).map((feature) => (
                  <tr key={feature} className="group hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-6 text-sm text-stone-300">{feature}</td>
                    {items.map((tier) => (
                      <td key={tier.id} className="py-3.5 text-center">
                        {(tier.features ?? []).includes(feature)
                          ? <CheckCircle2 className="inline h-5 w-5 text-gold-400" />
                          : <X className="inline h-4 w-4 text-stone-700" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  {items.map((tier) => (
                    <td key={tier.id} className="pt-6 text-center">
                      <a href="#contact"
                        className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
                          tier.is_popular
                            ? 'bg-gold-gradient text-ink-950'
                            : 'border border-gold-500/30 text-gold-100 hover:border-gold-400'
                        }`}>
                        Select <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </Reveal>
        )}

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-stone-400">Prices are indicative. Final quotes depend on footage length, complexity, and turnaround.</p>
        </Reveal>
      </div>
    </section>
  );
}
