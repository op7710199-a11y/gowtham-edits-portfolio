import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { Icon } from '../Icon';
import { WHY_CHOOSE } from '../../data/content';

export function WhyChoose() {
  return (
    <section id="why" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[40vh] w-[40vh] rounded-full bg-gold-500/10 blur-[110px]" />

      <div className="container-mx">
        <SectionHeading
          eyebrow="Why GOWTHAM EDITS"
          title={<>More than an editor — <span className="text-gradient-gold">a partner</span></>}
          subtitle="You don't just hand over footage. You bring a story, and I shape every frame around it."
        />

        <RevealScope className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} as="article">
              <div className="card-glass group h-full p-7 text-center hover:border-gold-500/30 hover:bg-white/[0.06]">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-500/10 text-gold-300 transition-all duration-500 group-hover:bg-gold-gradient group-hover:text-ink-950"><Icon name={item.icon} className="h-7 w-7" /></div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </RevealScope>
      </div>
    </section>
  );
}
