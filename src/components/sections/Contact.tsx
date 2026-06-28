import { MessageCircle, Instagram, Mail, MapPin, Send, Loader2, CheckCircle2, AlertCircle, Youtube, Facebook, Linkedin } from 'lucide-react';
import { Reveal, RevealScope, SectionHeading } from '../Reveal';
import { useSiteSettings } from '../../hooks/useSupabaseQueries';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';
interface FormErrors { name?: string; email?: string; message?: string; }
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

const SERVICE_OPTIONS = ['Wedding Video Editing', 'Haldi Highlights', 'Pre-Wedding Cinematics', 'Bike Cinematic Editing', 'Instagram Reels Editing', 'YouTube Video Editing', 'Color Grading', 'Motion Graphics', 'Custom Editing Services'];

const FALLBACK_CONTACT = {
  instagram_url: 'https://www.instagram.com/gowtham.edits1',
  instagram_handle: 'gowtham.edits1',
  whatsapp_number: '9676831437',
  whatsapp_display: '+91 96768 31437',
  email: 'gowthamedits37@gmail.com',
  location: 'Hyderabad, Telangana, India, Worldwide',
};

export function Contact() {
  const { data: settings } = useSiteSettings();
  const s = { ...FALLBACK_CONTACT, ...Object.fromEntries(Object.entries(settings ?? {}).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)])) };
  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsapp: '', service: '', project_type: '', budget_range: '', delivery_deadline: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('submitting');
    try {
      const { error } = await supabase.from('inquiries').insert({ ...form, source: 'website' });
      if (error) throw error;
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  const inputClass = "w-full rounded-2xl border border-gold-500/20 bg-black/40 px-6 py-5 text-white backdrop-blur-md outline-none transition-all duration-500 focus:border-gold-400 focus:ring-2 focus:ring-gold-500/20";

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-1/4 -z-10 h-[35vh] w-[35vh] rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="container-mx">
        <SectionHeading
          eyebrow="LET'S CREATE"
          title={<>Start Your <span className="text-gradient-gold"> Next Masterpiece</span></>}
          subtitle="Tell me about your project and I'll transform it into a cinematic experience."
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            {[ 
              { icon: MessageCircle, label: 'WhatsApp', value: s.whatsapp_display, href: `https://wa.me/${s.whatsapp_number}` },
              { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}` },
              { icon: MapPin, label: 'Location', value: s.location }
            ].map((c, i) => (
              <a key={i} href={c.href || '#'} className="flex items-center gap-6 rounded-[24px] border border-white/5 bg-white/5 p-6 transition hover:border-gold-500/30">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-500/10 text-gold-400"><c.icon className="h-7 w-7" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-stone-500">{c.label}</div>
                  <div className="text-lg font-bold text-white">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 sm:p-10">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-green-500/10 text-green-400"><CheckCircle2 className="h-10 w-10" /></div>
                <h3 className="text-2xl font-bold text-white">Message sent!</h3>
                <p className="mt-2 text-stone-400">I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className={inputClass} />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className={inputClass} />
                </div>
                <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                  <option value="">Select Service</option>
                  {SERVICE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your vision..." className={`${inputClass} min-h-[180px]`} />
                <button type="submit" disabled={status === 'submitting'} className="w-full rounded-full bg-gold-gradient py-5 text-lg font-bold text-black transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(198,146,33,.45)]">
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
