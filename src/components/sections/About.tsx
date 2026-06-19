import { CheckCircle2, Clapperboard, Camera, Palette, Sparkles, Users, Clock, Award } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { TOOLS } from '../../data/content';

const STYLE_PILLARS = [
  { icon: Camera, title: 'Story-first editing', description: 'Every cut serves emotion. Before a beat drop or speed ramp, the story has to earn it.' },
  { icon: Palette, title: 'Signature color mood', description: 'Warm skin tones, deep shadows, golden highlights — a look that feels timeless and luxurious.' },
  { icon: Sparkles, title: 'Sound-driven rhythm', description: 'Sound design and music come first. Pacing follows the audio, not the other way around.' },
];

const EXPERIENCE = [
  { year: '2019', title: 'Started editing', detail: 'Began cutting wedding films & social reels for local creators.' },
  { year: '2021', title: 'Cinematic pivot', detail: 'Moved to film-grade color grading & motion graphic stings.' },
  { year: '2023', title: 'Bike cinematic series', detail: 'Launched a viral bike cinematic series online.' },
  { year: 'Today', title: '240+ projects shipped', detail: 'Editing for clients across India and worldwide.' },
];

const REASONS = [
  'Single editor — no agency handoffs',
  'Consistent style across every project',
  'Clear delivery dates, no surprises',
  'Reels, films & cinematics — one studio',
];

export function About() {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-[40vh] w-[40vh] rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="container-mx">
        <SectionHeading
          eyebrow="About"
          title={<>The editor behind <span className="text-gradient-gold">the films</span></>}
          subtitle="Hi, I'm Gowtham — a cinematic video editor obsessed with turning raw footage into memories that feel like movies."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img
                  src="https://images.pexels.com/photos/3785084/pexels-photo-3785084.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop"
                  alt="Gowtham — video editor at work"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-gradient text-ink-950">
                    <Clapperboard className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <div>
                    <div className="font-display text-lg font-bold text-white">Gowtham</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gold-300">Lead Editor</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 hidden rotate-3 rounded-2xl border border-gold-500/30 bg-ink-900/80 px-5 py-4 backdrop-blur-md sm:block">
                <div className="font-display text-2xl font-bold text-gradient-gold">5+</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Years editing</div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-base leading-relaxed text-stone-300 sm:text-lg">
                I'm a cinematic video editor specializing in weddings, haldi celebrations, pre-wedding
                stories, bike cinematic cuts, and high-retention reels &amp; social content. My approach
                is simple: story first, rhythm second, polish always. The result is films that feel
                less like highlight reels and more like a memory you'd want to replay forever.
              </p>
            </Reveal>

            <RevealScope className="mt-8 grid gap-4 sm:grid-cols-3">
              {STYLE_PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <div className="card-glass h-full p-5 hover:border-gold-500/30 hover:bg-white/[0.06]">
                    <p.icon className="h-7 w-7 text-gold-300" />
                    <h3 className="mt-3 font-display text-base font-semibold text-white">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-400">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </RevealScope>

            <Reveal className="mt-8">
              <h3 className="font-display text-lg font-semibold text-white">Why clients choose me</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {REASONS.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-stone-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-8">
              <h3 className="font-display text-lg font-semibold text-white">Tools &amp; software</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {TOOLS.map((t) => (
                  <span key={t} className="rounded-full border border-gold-500/20 bg-gold-500/[0.05] px-3.5 py-1.5 text-xs font-medium text-gold-100">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-16">
          <div className="glass rounded-2xl p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gold-300" />
              <h3 className="font-display text-xl font-bold text-white">Experience</h3>
            </div>
            <RevealScope className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {EXPERIENCE.map((e, i) => (
                <Reveal key={e.year} delay={i * 100}>
                  <div className="relative pl-5">
                    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-gold-gradient ring-4 ring-gold-500/15" />
                    {i < EXPERIENCE.length - 1 && (
                      <span className="absolute left-[4px] top-5 hidden h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-gold-500/40 to-transparent lg:block" />
                    )}
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{e.year}</div>
                    <h4 className="mt-1.5 font-display text-base font-semibold text-white">{e.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-stone-400">{e.detail}</p>
                  </div>
                </Reveal>
              ))}
            </RevealScope>
          </div>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-400">
          <span className="flex items-center gap-2"><Users className="h-4 w-4 text-gold-400" /> 180+ clients served</span>
          <span className="h-3 w-px bg-white/10" />
          <span className="flex items-center gap-2"><Award className="h-4 w-4 text-gold-400" /> 5.0 average rating</span>
        </Reveal>
      </div>
    </section>
  );
}
