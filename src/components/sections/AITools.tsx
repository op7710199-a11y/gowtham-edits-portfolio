import { useState } from 'react';
import { Sparkles, Calculator, ClipboardList, Lightbulb, ChevronRight, ArrowRight } from 'lucide-react';
import { SectionHeading, Reveal, RevealScope } from '../Reveal';

// ── AI Cost Estimator ──────────────────────────────────────────
const PROJECT_TYPES = ['Wedding Film', 'Pre-Wedding', 'Haldi Highlights', 'Bike Cinematic', 'Instagram Reel', 'YouTube Video', 'Commercial Ad', 'Music Video'];
const LENGTHS = ['< 1 min', '1–3 min', '3–5 min', '5–10 min', '10–20 min', '20+ min'];
const COMPLEXITIES = ['Basic (cuts + sync)', 'Standard (color + audio)', 'Premium (motion graphics + grade)', 'Cinematic (full production)'];
const RUSH = ['No rush (7+ days)', 'Standard (4–6 days)', 'Rush (2–3 days)', 'Same day'];

const BASE: Record<string, number> = { 'Wedding Film': 14999, 'Pre-Wedding': 9999, 'Haldi Highlights': 7999, 'Bike Cinematic': 8999, 'Instagram Reel': 4999, 'YouTube Video': 6999, 'Commercial Ad': 19999, 'Music Video': 24999 };
const LENGTH_MULT: Record<string, number> = { '< 1 min': 0.6, '1–3 min': 1, '3–5 min': 1.3, '5–10 min': 1.6, '10–20 min': 2, '20+ min': 2.5 };
const COMP_MULT: Record<string, number> = { 'Basic (cuts + sync)': 0.7, 'Standard (color + audio)': 1, 'Premium (motion graphics + grade)': 1.4, 'Cinematic (full production)': 1.8 };
const RUSH_MULT: Record<string, number> = { 'No rush (7+ days)': 1, 'Standard (4–6 days)': 1.1, 'Rush (2–3 days)': 1.3, 'Same day': 1.7 };

function CostEstimator() {
  const [type, setType] = useState('');
  const [length, setLength] = useState('');
  const [complexity, setComplexity] = useState('');
  const [rush, setRush] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const estimate = () => {
    if (!type || !length || !complexity || !rush) return;
    const base = BASE[type] ?? 9999;
    const total = Math.round(base * LENGTH_MULT[length] * COMP_MULT[complexity] * RUSH_MULT[rush]);
    setResult(total);
  };

  return (
    <div className="card-glass p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-gradient text-ink-950">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold text-white">AI Cost Estimator</h3>
          <p className="text-xs text-stone-400">Get an instant price estimate for your project</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: 'Project Type', value: type, setter: setType, options: PROJECT_TYPES },
          { label: 'Video Length', value: length, setter: setLength, options: LENGTHS },
          { label: 'Complexity', value: complexity, setter: setComplexity, options: COMPLEXITIES },
          { label: 'Turnaround', value: rush, setter: setRush, options: RUSH },
        ].map((f) => (
          <div key={f.label}>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">{f.label}</label>
            <select value={f.value} onChange={(e) => { f.setter(e.target.value); setResult(null); }} className="admin-select">
              <option value="">Select…</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <button type="button" onClick={estimate} disabled={!type || !length || !complexity || !rush}
        className="mt-5 w-full btn-primary py-3.5 disabled:opacity-40">
        <Sparkles className="h-4 w-4" /> Calculate Estimate
      </button>

      {result !== null && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-gold-500/30 bg-gold-500/[0.06] p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-stone-400">Estimated Investment</div>
          <div className="mt-2 font-display text-4xl font-bold text-gradient-gold">₹{result.toLocaleString('en-IN')}</div>
          <p className="mt-2 text-xs text-stone-400">Final pricing depends on footage length, complexity, and revisions. This is an indicative estimate.</p>
          <a href="#contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-100">
            Get exact quote <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}

// ── AI Requirements Generator ──────────────────────────────────
const BRIEFS: Record<string, string[]> = {
  'Wedding Film': ['Provide RAW footage from all cameras (primary + backup)', 'Shortlist key moments: vows, entry, rings, first look', 'Share ceremony timeline and song preferences', 'Specify total runtime (Highlight: 5–8 min, Full film: 20–45 min)', 'Provide contact details for drone/photographer coordination'],
  'Instagram Reel': ['Provide 30–60 sec of best clips (vertical preferred)', 'Identify the hook moment (first 3 seconds)', 'Share trending audio or preferred music', 'Specify the CTA (follow, link in bio, etc.)', 'Reference reels you like for style direction'],
  'Bike Cinematic': ['Share all ride footage — straight roads, curves, detail shots', 'Provide audio: engine revs, ambient sounds', 'Specify bike model and desired mood (aggressive/elegant)', 'Share any drone/GoPro footage available', 'Reference films for color tone (dark, warm, moody)'],
  'Commercial Ad': ['Brand guidelines (colors, fonts, tone of voice)', 'Script or key messaging points', 'Target audience and platform (YouTube, Instagram, TV)', '15 sec / 30 sec / 60 sec version required?', 'Logo files and any existing brand assets'],
};

function RequirementsGenerator() {
  const [type, setType] = useState('');
  const [shown, setShown] = useState(false);

  const generate = () => { if (type) setShown(true); };

  return (
    <div className="card-glass p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-gradient text-ink-950">
          <ClipboardList className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold text-white">Project Brief Generator</h3>
          <p className="text-xs text-stone-400">Know exactly what to prepare before contacting us</p>
        </div>
      </div>

      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Project Type</label>
      <select value={type} onChange={(e) => { setType(e.target.value); setShown(false); }} className="admin-select">
        <option value="">Choose your project…</option>
        {Object.keys(BRIEFS).map((k) => <option key={k} value={k}>{k}</option>)}
      </select>
      <button type="button" onClick={generate} disabled={!type}
        className="mt-4 w-full btn-primary py-3.5 disabled:opacity-40">
        <Lightbulb className="h-4 w-4" /> Generate Requirements
      </button>

      {shown && type && BRIEFS[type] && (
        <div className="mt-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-3">What to prepare for {type}</div>
          {BRIEFS[type].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-gradient text-[10px] font-bold text-ink-950">{i + 1}</span>
              <span className="text-sm text-stone-200">{item}</span>
            </div>
          ))}
          <a href="#contact" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/[0.05] py-3 text-sm font-semibold text-gold-100 hover:border-gold-400 hover:bg-gold-500/15">
            I'm ready — Contact Now <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}

// ── Service Recommender ────────────────────────────────────────
const RECOMMENDER_QUESTIONS = [
  { q: 'What is the occasion?', opts: ['Wedding / Haldi / Pre-Wedding', 'Bike / Outdoor Adventure', 'Brand / Commercial', 'Social Media Growth', 'YouTube Channel', 'Music / Entertainment'] },
  { q: 'What is your budget?', opts: ['Under ₹5,000', '₹5,000–₹15,000', '₹15,000–₹30,000', '₹30,000+', 'Flexible — quality first'] },
  { q: 'When do you need it?', opts: ['Within 24 hours', '2–3 days', '1 week', '2+ weeks'] },
];
const RECOMMENDATIONS: Record<string, { name: string; desc: string; price: string }> = {
  'Wedding / Haldi / Pre-Wedding': { name: 'Wedding Cinematic Package', desc: 'Full ceremony film, haldi highlights, and pre-wedding cinematic — one cohesive story.', price: 'From ₹14,999' },
  'Bike / Outdoor Adventure': { name: 'Bike Cinematic Edit', desc: 'Speed ramps, sound design, color grade — your ride as a film.', price: 'From ₹8,999' },
  'Brand / Commercial': { name: 'Commercial Ad Edit', desc: 'Branded video ads optimised for YouTube, Instagram, or TV placement.', price: 'From ₹19,999' },
  'Social Media Growth': { name: 'Reel Editing Package', desc: 'Scroll-stopping vertical reels — beat-synced, trend-aware, CTA-driven.', price: 'From ₹4,999' },
  'YouTube Channel': { name: 'YouTube Long-Form Edit', desc: 'Watch-time-optimised edits with retention hooks, B-roll, and subtitles.', price: 'From ₹6,999' },
  'Music / Entertainment': { name: 'Music Video Edit', desc: 'Cinematic cuts, sync-to-beat editing, color grade, and motion graphics.', price: 'From ₹24,999' },
};

function ServiceRecommender() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{ name: string; desc: string; price: string } | null>(null);

  const answer = (opt: string) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (step < RECOMMENDER_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResult(RECOMMENDATIONS[next[0]] ?? RECOMMENDATIONS['Social Media Growth']);
    }
  };

  const reset = () => { setAnswers([]); setStep(0); setResult(null); };

  return (
    <div className="card-glass p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-gradient text-ink-950">
          <Lightbulb className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold text-white">Service Recommender</h3>
          <p className="text-xs text-stone-400">Answer 3 quick questions — get the perfect service match</p>
        </div>
      </div>

      {!result ? (
        <div>
          {/* Progress */}
          <div className="mb-5 flex items-center gap-2">
            {RECOMMENDER_QUESTIONS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-gold-gradient' : 'bg-ink-800'}`} />
            ))}
          </div>
          <p className="mb-4 font-display text-lg font-semibold text-white">{RECOMMENDER_QUESTIONS[step].q}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {RECOMMENDER_QUESTIONS[step].opts.map((opt) => (
              <button key={opt} type="button" onClick={() => answer(opt)}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm font-medium text-stone-200 transition-all hover:border-gold-500/40 hover:bg-gold-500/[0.06] hover:text-gold-100 active:scale-95">
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="rounded-2xl border border-gold-500/30 bg-gold-500/[0.06] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-400 mb-2">Perfect match for you</div>
            <h4 className="font-display text-xl font-bold text-white">{result.name}</h4>
            <p className="mt-2 text-sm text-stone-300">{result.desc}</p>
            <div className="mt-3 font-display text-2xl font-bold text-gradient-gold">{result.price}</div>
            <div className="mt-4 flex gap-2">
              <a href="#contact" className="btn-primary flex-1 py-3 text-center text-sm">Request This</a>
              <button type="button" onClick={reset} className="btn-ghost px-4 py-3 text-sm">Retry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────
export function AITools() {
  return (
    <section id="ai-tools" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-1/3 -z-10 h-[50vh] w-[50vh] rounded-full bg-gold-500/8 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-1/3 -z-10 h-[40vh] w-[40vh] rounded-full bg-gold-500/6 blur-[100px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="AI-Powered Tools"
          title={<>Smart tools to <span className="text-gradient-gold">plan your edit</span></>}
          subtitle="Get instant estimates, project briefs, and personalised service recommendations — powered by smart logic built for video editing."
        />
        <RevealScope className="mt-14 grid gap-6 lg:grid-cols-3">
          <Reveal delay={0}><CostEstimator /></Reveal>
          <Reveal delay={100}><RequirementsGenerator /></Reveal>
          <Reveal delay={200}><ServiceRecommender /></Reveal>
        </RevealScope>
      </div>
    </section>
  );
}
