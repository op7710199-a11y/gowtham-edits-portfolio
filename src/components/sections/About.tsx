import { Quote, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading } from '../Reveal';
import { AboutSkeleton } from '../AboutSkeleton';
import { useAboutSettings } from '../../hooks/useSupabaseQueries';
import { PROFILE_PLACEHOLDER } from '../../constants/placeholders';

export function About() {
  const { data: about, isLoading, isError } = useAboutSettings();

  if (isLoading) {
    return <AboutSkeleton />;
  }

  if (isError) {
    return (
      <section className="section-padding">
        <div className="container-mx text-center text-stone-400">
          Failed to load about section.
        </div>
      </section>
    );
  }

  const safeAbout = about ?? {
    name: "Gowtham",
    title: "Professional Photo & Video Editor",
    bio: "Professional cinematic editor specializing in wedding films, reels and commercial storytelling.",
    profile_image_url: "",
    instagram_url: "",
    whatsapp_url: "",
    skills: [],
    quote: "",
    quote_author: "",
    cta_text: ""
  };

  const imageUrl = safeAbout.profile_image_url || PROFILE_PLACEHOLDER;

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-gold-500/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 top-1/3 -z-10 h-[35vh] w-[35vh] rounded-full bg-gold-600/[0.05] blur-[100px]" />

      <div className="container-mx">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              The editor behind <span className="text-gradient-gold">the films</span>
            </>
          }
          subtitle="Get to know the person behind every cut, color, and cinematic moment."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Portrait with circular glow */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
              {/* Rotating gold ring */}
              <div
                className="pointer-events-none absolute inset-0 -m-4 animate-spin-slow rounded-full border border-dashed border-gold-500/20"
                style={{ animationDuration: '30s' }}
              />
              {/* Outer glow */}
              <div className="pointer-events-none absolute inset-0 -m-2 rounded-full bg-gradient-to-b from-gold-500/20 via-gold-600/10 to-transparent blur-2xl" />

              <div className="relative aspect-square w-full overflow-hidden rounded-full border-2 border-gold-500/30 bg-ink-900 ring-4 ring-gold-500/[0.07]">
                <img
                  src={imageUrl}
                  alt={safeAbout.name || 'Profile'}
                  width={400}
                  height={400}
                  loading="lazy"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = PROFILE_PLACEHOLDER; }}
                />
                {/* Inner gradient overlay for cinematic depth */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
              </div>

              {/* Instagram badge */}
              {safeAbout.instagram_url && (
                <a
                  href={safeAbout.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 bg-ink-950/80 text-gold-300 backdrop-blur-md transition-all hover:scale-110 hover:bg-gold-500 hover:text-ink-950"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}

              {/* WhatsApp badge */}
              {safeAbout.whatsapp_url && (
                <a
                  href={safeAbout.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-2 top-2 grid h-10 w-10 place-items-center rounded-full border border-green-500/30 bg-ink-950/80 text-green-300 backdrop-blur-md transition-all hover:scale-110 hover:bg-green-500 hover:text-ink-950"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </Reveal>

          {/* Right column */}
          <div>
            {/* Name & title */}
            <Reveal>
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{safeAbout.name || "Gowtham"}</h3>
                <p className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-gold-300">{safeAbout.title}</p>
              </div>
            </Reveal>

            {/* Bio */}
            <Reveal>
              <p className="text-base leading-relaxed text-stone-300 sm:text-lg">
                {safeAbout.bio || "Professional cinematic editor specializing in wedding films, reels and commercial storytelling."}
              </p>
            </Reveal>

            {/* Skills */}
            {(safeAbout.skills ?? []).length > 0 && (
              <Reveal className="mt-8">
                <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">Tools &amp; Expertise</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(safeAbout.skills ?? []).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-gold-500/20 bg-gold-500/[0.05] px-3.5 py-1.5 text-xs font-medium text-gold-100 transition-all duration-300 hover:scale-105 hover:border-gold-500/40 hover:bg-gold-500/[0.1]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Quote */}
            {safeAbout.quote && (
              <Reveal className="mt-8">
                <div className="relative overflow-hidden rounded-2xl border border-gold-500/15 bg-gradient-to-br from-ink-900/60 to-ink-950/40 p-6">
                  <Quote className="absolute -right-2 -top-2 h-16 w-16 text-gold-500/10" />
                  <blockquote className="relative font-display text-base italic text-stone-200 sm:text-lg">
                    &ldquo;{safeAbout.quote}&rdquo;
                  </blockquote>
                  {safeAbout.quote_author && (
                    <cite className="mt-3 block text-xs font-semibold uppercase tracking-[0.25em] text-gold-300 not-italic">
                      &mdash; {safeAbout.quote_author}
                    </cite>
                  )}
                </div>
              </Reveal>
            )}

            {/* CTA */}
            {safeAbout.cta_text && (
              <Reveal className="mt-8">
                <a
                  href="#contact"
                  aria-label={safeAbout.cta_text}
                  className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-ink-950 transition-all hover:shadow-[0_0_30px_rgba(198,146,33,0.4)]"
                >
                  {safeAbout.cta_text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
