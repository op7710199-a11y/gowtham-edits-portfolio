import { useState, type FormEvent } from 'react';
import { MessageCircle, Instagram, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle, Youtube, Facebook, Linkedin } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, EMAIL, LOCATION } from '../../data/content';
import { supabase } from '../../lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name';
  else if (values.name.trim().length < 2) errors.name = 'Name too short';
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email';
  if (!values.message.trim()) errors.message = 'Tell me about your project';
  else if (values.message.trim().length < 10) errors.message = 'A little more detail helps';
  return errors;
}

const PROJECT_TYPES = ['Wedding Film', 'Pre-Wedding Cinematic', 'Haldi Highlights', 'Bike Cinematic', 'Instagram Reel', 'YouTube Video', 'Commercial Ad', 'Music Video', 'Other'];
const BUDGETS = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹50,000', '₹50,000+', 'Not sure — advise me'];
const DEADLINES = ['24 hours', '2–3 days', 'This week', 'Next week', '2–4 weeks', 'Flexible'];

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsapp: '', service: '', project_type: '', budget_range: '', delivery_deadline: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (touched[key]) setErrors(validate({ ...form, [key]: value }));
  };

  const handleBlur = (key: keyof typeof form) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(form));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); setTouched({ name: true, email: true, message: true }); return; }
    setStatus('submitting');
    try {
      const { error } = await supabase.from('inquiries').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        service: form.project_type || form.service || null,
        project_type: form.project_type || null,
        budget_range: form.budget_range || null,
        delivery_deadline: form.delivery_deadline || null,
        message: form.message.trim(),
        status: 'new',
        source: 'website',
      });
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', phone: '', whatsapp: '', service: '', project_type: '', budget_range: '', delivery_deadline: '', message: '' });
      setTouched({});
    } catch (e) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    }
  };

  const inputBase = (hasError: boolean) =>
    `w-full rounded-xl border bg-ink-900/60 px-4 py-3.5 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none transition-colors ${
      hasError ? 'border-red-500/50 focus:border-red-400' : 'border-white/10 focus:border-gold-500/50'
    }`;

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-[50vh] w-[50vh] rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="Contact"
          title={<>Let's create something <span className="text-gradient-gold">cinematic</span></>}
          subtitle="Drop your project details below and I'll come back with a quote within a few hours."
        />

        <RevealScope className="mt-14 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* ── Form ── */}
          <Reveal>
            {status === 'success' ? (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-green-500/30 bg-green-500/[0.06] p-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-400" />
                <h3 className="mt-5 font-display text-2xl font-bold text-white">Message Sent!</h3>
                <p className="mt-3 text-sm text-stone-300 max-w-sm">Your inquiry has been received. I'll get back to you within a few hours — usually sooner.</p>
                <button type="button" onClick={() => setStatus('idle')} className="mt-6 btn-ghost py-3 px-8">Send Another</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Name *</label>
                    <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} onBlur={() => handleBlur('name')}
                      placeholder="Your full name" className={inputBase(!!errors.name)} />
                    {errors.name && touched.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} onBlur={() => handleBlur('email')}
                      placeholder="you@example.com" className={inputBase(!!errors.email)} />
                    {errors.email && touched.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                      placeholder="+91 90000 00000" className={inputBase(false)} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">WhatsApp</label>
                    <input type="tel" value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)}
                      placeholder="+91 90000 00000" className={inputBase(false)} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Project Type</label>
                    <select value={form.project_type} onChange={(e) => update('project_type', e.target.value)} className={inputBase(false)}>
                      <option value="">Select type…</option>
                      {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Budget Range</label>
                    <select value={form.budget_range} onChange={(e) => update('budget_range', e.target.value)} className={inputBase(false)}>
                      <option value="">Select budget…</option>
                      {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Delivery Deadline</label>
                    <select value={form.delivery_deadline} onChange={(e) => update('delivery_deadline', e.target.value)} className={inputBase(false)}>
                      <option value="">When do you need it?</option>
                      {DEADLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">Project Details *</label>
                  <textarea value={form.message} onChange={(e) => update('message', e.target.value)} onBlur={() => handleBlur('message')}
                    rows={4} placeholder="Describe your project — event date, style preferences, footage details, anything helpful…"
                    className={`${inputBase(!!errors.message)} resize-none`} />
                  {errors.message && touched.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                </div>
                {status === 'error' && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-xs text-red-200">{errorMsg}</p>
                  </div>
                )}
                <button type="submit" disabled={status === 'submitting'}
                  className="btn-primary w-full py-4 text-base disabled:opacity-60">
                  {status === 'submitting'
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    : <><Send className="h-4 w-4" /> Send Inquiry</>
                  }
                </button>
                <p className="text-center text-xs text-stone-500">Replies within a few hours. Your details are never shared.</p>
              </form>
            )}
          </Reveal>

          {/* ── Contact info ── */}
          <Reveal>
            <div className="space-y-6">
              <div className="card-glass p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Get in touch</h3>
                <div className="space-y-4">
                  {[
                    { icon: MessageCircle, label: 'WhatsApp', value: WHATSAPP_DISPLAY, href: `https://wa.me/${WHATSAPP_NUMBER}`, color: 'text-green-400' },
                    { icon: Instagram, label: 'Instagram', value: `@${INSTAGRAM_HANDLE}`, href: INSTAGRAM_URL, color: 'text-pink-400' },
                    { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, color: 'text-gold-300' },
                    { icon: MapPin, label: 'Location', value: LOCATION, href: null, color: 'text-blue-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] ${item.color}`}>
                        <item.icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{item.label}</div>
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-medium text-stone-200 hover:text-gold-100 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-sm text-stone-300">{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div className="card-glass p-6">
                <h3 className="font-display text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Follow the work</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Instagram, href: INSTAGRAM_URL, label: 'Instagram', color: 'hover:border-pink-500/40 hover:text-pink-300' },
                    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:border-red-500/40 hover:text-red-300' },
                    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:border-blue-500/40 hover:text-blue-300' },
                    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:border-sky-500/40 hover:text-sky-300' },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-stone-400 transition-all ${s.color}`}
                      title={s.label}>
                      <s.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick WhatsApp CTA */}
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'd like to discuss a video editing project.`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-green-200 transition-all hover:border-green-400/50 hover:bg-green-500/15 hover:scale-[1.01]">
                <MessageCircle className="h-5 w-5" />
                <div>
                  <div className="text-sm font-semibold">Start on WhatsApp</div>
                  <div className="text-xs text-green-400/70">Fastest response — usually within the hour</div>
                </div>
              </a>
            </div>
          </Reveal>
        </RevealScope>
      </div>
    </section>
  );
}
