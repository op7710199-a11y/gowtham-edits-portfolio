import { MessageCircle, Instagram, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle, Youtube, Facebook, Linkedin } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { useSiteSettings } from '../../hooks/useSupabaseQueries';
import { supabase } from '../../lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Name is required';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  else if (!values.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email';
  else if (!values.message.trim()) errors.message = 'Message is required';
  else if (values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

const SERVICE_OPTIONS = [
  'Wedding Video Editing',
  'Haldi Highlights',
  'Pre-Wedding Cinematics',
  'Bike Cinematic Editing',
  'Instagram Reels Editing',
  'YouTube Video Editing',
  'Color Grading',
  'Motion Graphics',
  'Custom Editing Services',
];

const FALLBACK_CONTACT = {
  instagram_url: 'https://www.instagram.com/gowtham.edits1',
  instagram_handle: 'gowtham.edits1',
  whatsapp_number: 'XXXXXXXXXX',
  whatsapp_display: '+91 90000 00000',
  email: 'hello@gowthamedits.com',
  location: 'Bengaluru, India • Worldwide remote',
  youtube_url: '',
  facebook_url: '',
  linkedin_url: '',
};

export function Contact() {
  const { data: settings } = useSiteSettings();
  const s = { ...FALLBACK_CONTACT, ...Object.fromEntries(
    Object.entries(settings ?? {}).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)])
  ) };
  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsapp: '', service: '', project_type: '', budget_range: '', delivery_deadline: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const next = validate({ ...form, [name]: value });
      setErrors((p) => ({ ...p, [name]: next[name] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const next = validate(form);
    setErrors((p) => ({ ...p, [name]: next[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    setErrorMsg('');
    try {
      const { error } = await supabase.from('inquiries').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        service: form.service || null,
        project_type: form.project_type || null,
        budget_range: form.budget_range || null,
        delivery_deadline: form.delivery_deadline || null,
        message: form.message.trim(),
        source: 'website',
      });
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', phone: '', whatsapp: '', service: '', project_type: '', budget_range: '', delivery_deadline: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const contactCards = [
    { icon: MessageCircle, label: 'WhatsApp', value: s.whatsapp_display, href: `https://wa.me/${s.whatsapp_number}`, color: 'text-green-400' },
    { icon: Instagram, label: 'Instagram', value: `@${s.instagram_handle}`, href: s.instagram_url, color: 'text-pink-400' },
    { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}`, color: 'text-gold-300' },
    { icon: MapPin, label: 'Location', value: s.location, href: null, color: 'text-blue-400' },
  ];

  const socialLinks = [
    { icon: Instagram, href: s.instagram_url, label: 'Instagram', color: 'hover:border-pink-500/40 hover:text-pink-300' },
    { icon: Youtube, href: s.youtube_url || '#', label: 'YouTube', color: 'hover:border-red-500/40 hover:text-red-300' },
    { icon: Facebook, href: s.facebook_url || '#', label: 'Facebook', color: 'hover:border-blue-500/40 hover:text-blue-300' },
    { icon: Linkedin, href: s.linkedin_url || '#', label: 'LinkedIn', color: 'hover:border-sky-500/40 hover:text-sky-300' },
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-1/4 -z-10 h-[35vh] w-[35vh] rounded-full bg-gold-500/10 blur-[120px]" />

      <div className="container-mx">
        <SectionHeading
          eyebrow="Get In Touch"
          title={
            <>
              Let's create something <span className="text-gradient-gold">worth watching</span>
            </>
          }
          subtitle="Tell me about your project. Whether it's a wedding, a reel, or a bike edit — I'll get back within 24 hours."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* Contact info */}
          <RevealScope className="space-y-4">
            {contactCards.map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-gold-500/30 hover:bg-white/[0.04]"
                  >
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.03] ${c.color}`}>
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-stone-500">{c.label}</div>
                      <div className="truncate text-sm font-medium text-stone-200">{c.value}</div>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.03] ${c.color}`}>
                      <c.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-stone-500">{c.label}</div>
                      <div className="truncate text-sm font-medium text-stone-200">{c.value}</div>
                    </div>
                  </div>
                )}
              </Reveal>
            ))}

            <Reveal delay={320}>
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((sl) => (
                  <a
                    key={sl.label}
                    href={sl.href}
                    target={sl.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={sl.label}
                    className={`grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-stone-400 transition-all ${sl.color}`}
                  >
                    <sl.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </Reveal>
          </RevealScope>

          {/* Form */}
          <Reveal delay={150}>
            <form
n              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8"
            >
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-green-500/10 text-green-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">Message sent!</h3>
                  <p className="max-w-sm text-sm text-stone-400">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="btn-ghost px-5 py-2.5 text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  {status === 'error' && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Your full name"
                          className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none ${
                            touched.name && errors.name ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-gold-500/50'
                          }`}
                        />
                        {touched.name && errors.name && (
                          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="you@example.com"
                          className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none ${
                            touched.email && errors.email ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-gold-500/50'
                          }`}
                        />
                        {touched.email && errors.email && (
                          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Optional"
                          className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">WhatsApp</label>
                        <input
                          type="tel"
                          name="whatsapp"
                          value={form.whatsapp}
                          onChange={handleChange}
                          placeholder="Optional"
                          className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:border-gold-500/50 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Service</label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 focus:border-gold-500/50 focus:outline-none"
                      >
                        <option value="">Select a service (optional)</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Budget Range</label>
                        <select
                          name="budget_range"
                          value={form.budget_range}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 focus:border-gold-500/50 focus:outline-none"
                        >
                          <option value="">Select range</option>
                          <option value="Under ₹5,000">Under ₹5,000</option>
                          <option value="₹5,000 – ₹15,000">₹5,000 – ₹15,000</option>
                          <option value="₹15,000 – ₹30,000">₹15,000 – ₹30,000</option>
                          <option value="₹30,000+">₹30,000+</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">Delivery Deadline</label>
                        <select
                          name="delivery_deadline"
                          value={form.delivery_deadline}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 focus:border-gold-500/50 focus:outline-none"
                        >
                          <option value="">Select deadline</option>
                          <option value="ASAP">ASAP (within 48 hours)</option>
                          <option value="1 week">Within 1 week</option>
                          <option value="2 weeks">Within 2 weeks</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-400">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={5}
                        placeholder="Tell me about your project, footage, and what you're looking for..."
                        className={`w-full resize-none rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none ${
                          touched.message && errors.message ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/10 focus:border-gold-500/50'
                        }`}
                      />
                      {touched.message && errors.message && (
                        <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-primary w-full py-3.5 disabled:opacity-60"
                    >
                      {status === 'submitting' ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="h-4 w-4" /> Send Message</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </Reveal>
        </div>

        {/* WhatsApp CTA */}
        <Reveal delay={200}>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-500/10 text-green-400">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-white">Prefer WhatsApp?</h3>
                <p className="text-sm text-stone-400">Quick responses, easy file sharing.</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${s.whatsapp_number}?text=Hi, I'd like to discuss a video editing project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500/15 px-5 py-2.5 text-sm font-medium text-green-300 transition-all hover:bg-green-500/25"
            >
              <MessageCircle className="h-4 w-4" /> Chat now
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
