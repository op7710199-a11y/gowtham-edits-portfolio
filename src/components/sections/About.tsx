import { Quote, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading } from '../Reveal';
import { useAboutSettings } from '../../hooks/useSupabaseQueries';

export function About() {
  const { data: about, isLoading, isError } = useAboutSettings();

  if (isLoading) {
    return null;
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
    title: "CINEMATIC FILM EDITOR",
    bio: "Professional cinematic editor specializing in wedding films, reels and commercial storytelling.",
    profile_image_url: "",
    instagram_url: "",
    whatsapp_url: "",
    skills: [],
    quote: "",
    quote_author: "",
    cta_text: ""
  };

  const fallbackImage = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
  const imageUrl = safeAbout.profile_image_url || fallbackImage;

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

        <div className="mt-24 grid items-center gap-20 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Portrait with circular glow */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              {/* Rotating gold ring */}
              <div
                className="pointer-events-none absolute inset-0 -m-4 animate-spin-slow rounded-full border border-dashed border-gold-500/20"
                style={{ animationDuration: '30s' }}
              />
              {/* Outer glow */}
              <div className="pointer-events-none absolute inset-0 -m-2 rounded-full bg-gradient-to-b from-gold-500/20 via-gold-600/10 to-transparent blur-[120px]" />

              <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-gold-400/40 bg-ink-900 ring-8 ring-gold-400/10">
                <img
                  src={imageUrl}
                  alt={safeAbout.name || 'Profile'}
                  width={600}
                  height={600}
                  loading="lazy"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
              </div>

              {/* Instagram badge */}
              {safeAbout.instagram_url && (
                <a
                  href={safeAbout.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-2 grid h-12 w-12 place-items-center rounded-full border border-gold-500/30 bg-ink-950/80 text-gold-300 backdrop-blur-md transition-all hover:scale-110 hover:bg-gold-500 hover:text-ink-950"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}

              {/* WhatsApp badge */}
              {safeAbout.whatsapp_url && (
                <a
                  href={safeAbout.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute left-2 top-2 grid h-12 w-12 place-items-center rounded-full border border-green-500/30 bg-ink-950/80 text-green-300 backdrop-blur-md transition-all hover:scale-110 hover:bg-green-500 hover:text-ink-950"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
            </div>
          </Reveal>

          {/* Right column */}
          <div>
            {/* Name & title */}
            <Reveal>
              <div className="mb-6">
                <h3 className="text-4xl lg:text-5xl font-bold text-white font-display">{safeAbout.name || "Gowtham"}</h3>
                <p className="mt-3 text-base uppercase tracking-[0.45em] text-gold-400">{safeAbout.title || "CINEMATIC FILM EDITOR"}</p>
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
                <div className="mt-4 flex flex-wrap gap-3">
                  {(safeAbout.skills ?? []).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-gold-500/40 bg-black/40 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-500 hover:bg-gold-500 hover:text-black hover:scale-105"
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
                  className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-4 text-base font-semibold text-ink-950 transition-all hover:shadow-[0_0_30px_rgba(198,146,33,0.4)]"
                >
                  {safeAbout.cta_text}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
