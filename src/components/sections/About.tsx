import { Quote, Instagram, ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading } from '../Reveal';
import { useAboutSettings } from '../../hooks/useAboutSettings';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#1a1814"/>
  <circle cx="200" cy="200" r="120" fill="#2a2620"/>
  <circle cx="200" cy="170" r="50" fill="#3a342a"/>
  <ellipse cx="200" cy="290" rx="80" ry="55" fill="#3a342a"/>
  <text x="200" y="355" font-family="system-ui" font-size="14" fill="#7a6840" text-anchor="middle" letter-spacing="2">PROFILE</text>
</svg>
`)}`;

export function About() {
  const { about, loading } = useAboutSettings();
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    if (!about.profile_image_url) { setPublicUrl(PLACEHOLDER_SVG); return; }
    if (about.profile_image_url.startsWith('http')) {
      setPublicUrl(about.profile_image_url);
    } else {
      const { data } = supabase.storage.from('about-assets').getPublicUrl(about.profile_image_url);
      setPublicUrl(data.publicUrl || PLACEHOLDER_SVG);
    }
  }, [about.profile_image_url]);

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

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Portrait with circular glow */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-sm">
              {/* Rotating gold ring */}
              <div className="pointer-events-none absolute inset-0 -m-4 animate-spin-slow rounded-full border border-dashed border-gold-500/20" style={{ animationDuration: '30s' }} />
              {/* Outer glow */}
              <div className="pointer-events-none absolute inset-0 -m-2 rounded-full bg-gradient-to-b from-gold-500/20 via-gold-600/10 to-transparent blur-2xl" />

              <div className="relative aspect-square w-full overflow-hidden rounded-full border-2 border-gold-500/30 bg-ink-900 ring-4 ring-gold-500/5">
                {loading ? (
                  <div className="h-full w-full animate-pulse bg-ink-800" />
                ) : (
                  <img
                    src={publicUrl}
                    alt={about.name || 'Profile'}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_SVG; }}
                  />
                )}
                {/* Inner gradient overlay for cinematic depth */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
              </div>

              {/* Name plate */}
              {about.name && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full">
                  <div className="rounded-2xl border border-gold-500/25 bg-ink-950/90 px-6 py-2.5 text-center backdrop-blur-md">
                    <div className="font-display text-base font-bold text-white">{about.name}</div>
                    {about.title && <div className="text-[10px] uppercase tracking-[0.25em] text-gold-300">{about.title}</div>}
                  </div>
                </div>
              )}

              {/* Instagram badge */}
              {about.instagram_url && (
                <a
                  href={about.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full border border-gold-500/30 bg-ink-950/80 text-gold-300 backdrop-blur-md transition-all hover:scale-110 hover:bg-gold-500 hover:text-ink-950"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </Reveal>

          {/* Right column */}
          <div>
            <Reveal>
              <p className="text-base leading-relaxed text-stone-300 sm:text-lg">
                {about.bio}
              </p>
            </Reveal>

            {/* Skills */}
            {about.skills.length > 0 && (
              <Reveal className="mt-8">
                <h3 className="font-display text-lg font-semibold text-white">Tools &amp; Expertise</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {about.skills.map((s, i) => (
                    <span
                      key={s}
                      className="rounded-full border border-gold-500/20 bg-gold-500/[0.05] px-3.5 py-1.5 text-xs font-medium text-gold-100 transition-all hover:border-gold-500/40 hover:bg-gold-500/[0.1]"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Quote */}
            {about.quote && (
              <Reveal className="mt-8">
                <div className="relative overflow-hidden rounded-2xl border border-gold-500/15 bg-gradient-to-br from-ink-900/60 to-ink-950/40 p-6">
                  <Quote className="absolute -right-2 -top-2 h-16 w-16 text-gold-500/10" />
                  <blockquote className="relative font-display text-base italic text-stone-200 sm:text-lg">
                    "{about.quote}"
                  </blockquote>
                  {about.quote_author && (
                    <cite className="mt-3 block text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
                      — {about.quote_author}
                    </cite>
                  )}
                </div>
              </Reveal>
            )}

            {/* CTA */}
            {about.cta_text && (
              <Reveal className="mt-8">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-ink-950 transition-all hover:shadow-[0_0_30px_rgba(198,146,33,0.4)]"
                >
                  {about.cta_text}
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
