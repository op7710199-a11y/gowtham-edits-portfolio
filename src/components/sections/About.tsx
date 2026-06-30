import { Quote, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../Reveal';
import { useAboutSettings } from '../../hooks/useSupabaseQueries';

export function About() {
  const { data: about, isLoading, isError } = useAboutSettings();
  
  if (isLoading) return <div className="p-20 text-center animate-pulse text-gold-500">Loading...</div>;
  if (isError) return null;

  const safeAbout = about ?? { name: "Gowtham", title: "FILM EDITOR", bio: "Cinematic editor specializing in wedding films and reels.", skills: ['Premiere Pro', 'DaVinci Resolve'], instagram_url: '#', whatsapp_url: '#' };
  const stats = [{ label: '100+ Projects' }, { label: '5+ Years Exp' }, { label: 'Fast Delivery' }];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="container-mx grid lg:grid-cols-2 gap-20 items-center">
        {/* Portrait Column */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-square overflow-hidden rounded-full border-4 border-gold-400/40 bg-ink-900 ring-8 ring-gold-400/10">
            <img src={safeAbout.profile_image_url || "/profile.jpg"} alt={safeAbout.name} className="h-full w-full object-cover" />
          </div>
          <a href={safeAbout.instagram_url} className="absolute right-2 top-2 p-3 rounded-full bg-ink-950/80 text-gold-300"><Instagram size={20}/></a>
          <a href={safeAbout.whatsapp_url} className="absolute left-2 top-2 p-3 rounded-full bg-ink-950/80 text-green-300"><MessageCircle size={20}/></a>
        </div>

        {/* Text Column */}
        <div>
          <h3 className="text-5xl font-bold text-white font-display">{safeAbout.name}</h3>
          <p className="mt-3 text-gold-400 uppercase tracking-[0.45em]">{safeAbout.title}</p>
          <p className="mt-6 text-stone-300 leading-relaxed">{safeAbout.bio}</p>
          
          <div className="grid grid-cols-3 gap-4 my-8">
            {stats.map(s => <div key={s.label} className="border border-white/10 bg-white/5 p-4 rounded-xl text-[10px] font-bold uppercase text-center text-stone-300">{s.label}</div>)}
          </div>

          <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-4 font-bold text-ink-950 hover:shadow-lg transition-all">
            Let's Talk <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
