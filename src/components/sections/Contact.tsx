import { useState } from 'react';
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    service: '', 
    budget: '', 
    deadline: '', 
    message: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const { error } = await supabase
        .from("inquiries")
        .insert([
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            service: form.service,
            message: form.message,
            budget_range: form.budget,
            delivery_deadline: form.deadline,
            status: "New",
            source: "Website",
            created_at: new Date().toISOString()
          },
        ]);

      if (error) {
        console.log(error);
        alert(JSON.stringify(error, null, 2));
        throw error;
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        budget: "",
        deadline: "",
        message: "",
      });

      setStatus("success");
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("idle");
    }
  };

  return (
    <section id="contact" className="section-padding bg-ink-950">
      <div className="container-mx">
        {/* Trust Section */}
        <div className="text-center mb-20 animate-in fade-in duration-1000">
          <p className="text-gold-400 font-bold uppercase tracking-[0.2em] mb-8">Trusted by creators, brands and couples</p>
          <div className="grid grid-cols-3 max-w-2xl mx-auto gap-8">
            {[ { n: '100+', l: 'Projects' }, { n: '50+', l: 'Happy Clients' }, { n: '98%', l: 'Satisfaction' } ].map(s => (
              <div key={s.l} className="p-4 border border-white/5 rounded-2xl bg-white/5">
                <div className="text-3xl font-bold text-white mb-1">{s.n}</div>
                <div className="text-[10px] text-stone-500 uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {status === 'success' ? (
          <div className="text-center py-20 animate-in zoom-in duration-500">
            <div className="h-24 w-24 bg-gold-gradient rounded-full mx-auto flex items-center justify-center text-black text-5xl font-bold mb-8 shadow-[0_0_40px_rgba(198,146,33,0.3)]">✓</div>
            <h2 className="text-4xl font-bold text-white">Thank You!</h2>
            <p className="text-stone-400 mt-4 text-lg">Your project request has been received. We'll contact you within 1 hour.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold font-display text-white">Let's turn your vision into a masterpiece.</h2>
              <div className="space-y-6">
                {[ 
                  { icon: MessageCircle, text: 'WhatsApp', sub: '+91 96768 31437' },
                  { icon: Mail, text: 'Email', sub: 'gowthamedits37@gmail.com' },
                  { icon: MapPin, text: 'Location', sub: 'Hyderabad, Telangana' },
                  { icon: Clock, text: 'Response', sub: 'Within 1 hour' }
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-6 p-6 rounded-2xl border border-white/5 bg-white/5">
                    <item.icon className="text-gold-400" />
                    <div><div className="font-bold">{item.text}</div><div className="text-stone-400 text-sm">{item.sub}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
              <input required value={form.name} className="col-span-2 bg-black/50 border border-white/10 p-4 rounded-xl focus:border-gold-500 outline-none transition" placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} />
              <input required value={form.email} className="bg-black/50 border border-white/10 p-4 rounded-xl focus:border-gold-500 outline-none transition" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
              <input value={form.phone} className="bg-black/50 border border-white/10 p-4 rounded-xl focus:border-gold-500 outline-none transition" placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} />
              
              <select value={form.service} className="col-span-2 bg-black/50 border border-white/10 p-4 rounded-xl text-stone-400" onChange={e => setForm({...form, service: e.target.value})}>
                <option value="">Select Service</option>
                <option value="Wedding Film">Wedding Film</option>
                <option value="Reels Editing">Reels Editing</option>
              </select>

              <textarea required value={form.message} className="col-span-2 bg-black/50 border border-white/10 p-4 rounded-xl h-32 focus:border-gold-500 outline-none transition" placeholder="Project Details" onChange={e => setForm({...form, message: e.target.value})} />
              
              <button disabled={status === 'submitting'} className="col-span-2 bg-gold-gradient py-5 font-bold text-black rounded-xl hover:scale-[1.01] transition-transform shadow-lg shadow-gold-500/10">
                {status === 'submitting' ? 'Sending...' : 'Get Free Quote'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
