import { useState, type FormEvent } from 'react';
import { MessageCircle, Instagram, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { SERVICES, INSTAGRAM_URL, INSTAGRAM_HANDLE, WHATSAPP_NUMBER, WHATSAPP_DISPLAY, EMAIL, LOCATION } from '../../data/content';
import { supabase, type InquiryInsert } from '../../lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name';
  else if (values.name.trim().length < 2) errors.name = 'Name looks too short';
  if (!values.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email';
  if (!values.message.trim()) errors.message = 'Tell me about your project';
  else if (values.message.trim().length < 10) errors.message = 'A little more detail helps';
  return errors;
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (touched[key]) {
      const e = validate({ ...form, [key]: value });
      setErrors(e);
    }
  };

  const handleBlur = (key: keyof typeof form) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(form));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(v).length > 0) return;

    setStatus('submitting');
    setErrorMsg('');

    try {
      const payload: InquiryInsert = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        service: form.service || null,
        message: form.message.trim(),
      };
      const { error } = await supabase.from('inquiries').insert(payload);
      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? `Couldn't send — ${err.message}. Try WhatsApp instead.` : "Couldn't send the form. Please try WhatsApp instead.");
    }
  };

  const whatsappHref = `https://wa.me/91${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-gold-500/12 blur-[120px]" />

      <div className="container-mx">
        <SectionHeading
          eyebrow="Contact"
          title={<>Let's make your <span className="text-gradient-gold">film</span></>}
          subtitle="Tell me what you're planning. Reels, weddings, or full-event packages — I'll get back with a clear plan."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-95">
                  <MessageCircle className="h-5 w-5" /> WhatsApp me
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-2.5 rounded-2xl border border-gold-500/30 bg-gold-500/[0.05] py-4 text-sm font-semibold text-gold-100 transition-all hover:border-gold-400 hover:bg-gold-500/15 active:scale-95">
                  <Instagram className="h-5 w-5" /> Instagram DM
                </a>
              </div>

              <div className="glass flex-1 rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold text-white">Reach out directly</h3>
                <ul className="mt-5 space-y-5 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><MessageCircle className="h-5 w-5" /></span>
                    <div><div className="text-[10px] uppercase tracking-[0.15em] text-stone-500">WhatsApp</div><div className="font-medium text-stone-200">{WHATSAPP_DISPLAY}</div></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><Mail className="h-5 w-5" /></span>
                    <div><div className="text-[10px] uppercase tracking-[0.15em] text-stone-500">Email</div><a href={`mailto:${EMAIL}`} className="font-medium text-stone-200 hover:text-gold-100">{EMAIL}</a></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><Instagram className="h-5 w-5" /></span>
                    <div><div className="text-[10px] uppercase tracking-[0.15em] text-stone-500">Instagram</div><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-stone-200 hover:text-gold-100">@{INSTAGRAM_HANDLE}</a></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500/10 text-gold-300"><MapPin className="h-5 w-5" /></span>
                    <div><div className="text-[10px] uppercase tracking-[0.15em] text-stone-500">Location</div><div className="font-medium text-stone-200">{LOCATION}</div></div>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <RevealScope>
            <Reveal>
              <form onSubmit={onSubmit} noValidate className="glass rounded-2xl p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-white">Inquiry form</h3>
                <p className="mt-1 text-sm text-stone-400">Fill in the details and I'll reach out with a tailored plan.</p>

                {status === 'success' && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
                    <div><div className="text-sm font-semibold text-green-300">Inquiry sent</div><p className="mt-0.5 text-xs text-stone-300">Thanks for reaching out. I'll get back within a few hours. For instant chat, use WhatsApp.</p></div>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <p className="text-sm text-red-200">{errorMsg}</p>
                  </div>
                )}

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="name" value={form.name} onChange={(v) => update('name', v)} onBlur={() => handleBlur('name')} error={touched.name ? errors.name : undefined} placeholder="Your name" required />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={(v) => update('email', v)} onBlur={() => handleBlur('email')} error={touched.email ? errors.email : undefined} placeholder="you@email.com" required />
                  <Field label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={(v) => update('phone', v)} placeholder="+91 ..." />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="service" className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Service</label>
                    <select id="service" name="service" value={form.service} onChange={(e) => update('service', e.target.value)} className="rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors focus:border-gold-500/60">
                      <option value="">Pick a service…</option>
                      {SERVICES.map((s) => (<option key={s.id} value={s.title}>{s.title}</option>))}
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">Project details</label>
                  <textarea id="message" name="message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} onBlur={() => handleBlur('message')} placeholder="Tell me about your footage, event date, style, and any deadline…" className={`resize-none rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-gold-500/60 ${touched.message && errors.message ? 'border-red-500/60' : 'border-white/10'}`} />
                  {touched.message && errors.message && (<span className="text-xs text-red-400">{errors.message}</span>)}
                </div>

                <button type="submit" disabled={status === 'submitting' || status === 'success'} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">
                  {status === 'submitting' ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>) : (<><Send className="h-4 w-4" /> Send inquiry</>)}
                </button>

                <p className="mt-3 text-center text-xs text-stone-500">By submitting you agree to be contacted about your project. No spam, ever.</p>
              </form>
            </Reveal>
          </RevealScope>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, value, onChange, onBlur, error, placeholder, type = 'text', required,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  onBlur?: () => void; error?: string; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} required={required} className={`rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-gold-500/60 ${error ? 'border-red-500/60' : 'border-white/10'}`} />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
