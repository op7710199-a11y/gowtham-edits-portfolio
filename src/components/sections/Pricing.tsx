import { useState } from 'react';
import { Truck, CreditCard, LayoutList } from 'lucide-react';
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
      <div className="container-mx">
        <SectionHeading
          eyebrow="PRICING"
          title={<>Choose Your <span className="text-gradient-gold">Editing Package</span></>}
          subtitle="Transparent pricing with premium quality and cinematic storytelling."
        />

        {/* View Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-black/40 p-1">
            <ToggleBtn active={mode === 'cards'} onClick={() => setMode('cards')} icon={<CreditCard />} label="Cards" />
            <ToggleBtn active={mode === 'table'} onClick={() => setMode('table')} icon={<LayoutList />} label="Compare" />
          </div>
        </div>

        {mode === 'cards' ? <PricingCards items={items} /> : <PricingTable items={items} />}

        <p className="mt-12 text-center text-xs text-stone-500">
          Prices are indicative. Final quotes depend on project complexity and turnaround.
        </p>
      </div>
    </section>
  );
}

// Sub-components for better organization
function ToggleBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold uppercase transition-all ${active ? 'bg-gold-gradient text-black' : 'text-stone-400 hover:text-white'}`}>
      {icon} {label}
    </button>
  );
}

function PricingCards({ items }: { items: PricingTier[] }) {
  return (
    <RevealScope className="mt-20 grid gap-8 lg:grid-cols-3">
      {items.map((tier, i) => (
        <Reveal key={tier.id ?? i} delay={i * 120} as="article">
          <div className="group relative rounded-[32px] border border-gold-500/20 bg-gradient-to-b from-ink-900 to-black p-8 h-full hover:border-gold-400 transition-all">
            {tier.is_popular && <span className="absolute right-6 top-6 rounded-full bg-gold-gradient px-4 py-1.5 text-[10px] font-bold uppercase text-black">Popular</span>}
            <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
            <div className="mt-6 text-4xl font-bold text-white">{tier.price_label}</div>
            <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
              {tier.features?.map(f => <li key={f} className="text-sm text-stone-300 flex items-center gap-3">✓ {f}</li>)}
            </ul>
            <a href="#contact" className="mt-8 block w-full text-center rounded-full bg-gold-gradient py-4 font-bold text-black">Select Plan</a>
          </div>
        </Reveal>
      ))}
    </RevealScope>
  );
}

function PricingTable({ items }: { items: PricingTier[] }) {
  const allFeatures = Array.from(new Set(items.flatMap(t => t.features ?? [])));
  return (
    <div className="mt-12 overflow-x-auto border border-white/10 rounded-2xl bg-black/20">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-6 text-left text-stone-400">Feature</th>
            {items.map(t => <th key={t.id} className="p-6 text-gold-400">{t.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map(f => (
            <tr key={f} className="border-b border-white/5 last:border-0">
              <td className="p-4 text-stone-300">{f}</td>
              {items.map(t => <td key={t.id} className="p-4 text-center text-stone-500">{t.features?.includes(f) ? '✓' : '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
