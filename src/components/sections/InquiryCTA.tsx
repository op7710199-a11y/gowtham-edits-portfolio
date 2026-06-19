import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Reveal } from '../Reveal';

interface Props {
  heading?: string;
  subtext?: string;
}

export function InquiryCTA({
  heading = 'Ready to turn your moments into cinema?',
  subtext = "Send your footage today — the next edit could be yours. Let's craft something unforgettable.",
}: Props) {
  return (
    <section className="section-padding-sm relative overflow-hidden">
      <div className="container-mx">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl border border-gold-500/20 bg-ink-900/60 p-8 text-center backdrop-blur-xl sm:p-14">
            <div className="pointer-events-none absolute -top-1/3 left-1/2 -z-10 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(217,173,50,0.12),transparent_60%)]" />

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-gradient text-ink-950 shadow-gold-glow">
              <Sparkles className="h-7 w-7" />
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{heading}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">{subtext}</p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#contact" className="btn-primary group">Inquire Now<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              <a href="#portfolio" className="btn-ghost">View Portfolio</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
