import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { generateBrief } from '../../utils/projectBrief';
import { FileText, Copy, Download, MessageCircle } from 'lucide-react';
import jsPDF from 'jspdf';

export function BriefGenerator() {
  const [brief, setBrief] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', service: '', style: '', mood: '', duration: '', platform: '' });

  const handleGenerate = async () => {
    const generatedBrief = generateBrief(form);
    
    await supabase.from("ai_requests").insert([{
      tool_type: "brief_generator",
      name: form.name,
      email: form.email,
      generated_brief: generatedBrief,
      service: form.service,
      status: "new"
    }]);

    setBrief(generatedBrief);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(brief || '', 10, 10);
    doc.save("ProjectBrief.pdf");
  };

  return (
    <div className="p-8 rounded-3xl border border-gold-500/20 bg-black/40 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Project Brief Generator</h2>
      
      {!brief ? (
        <div className="grid gap-4">
          {/* Add your form inputs here bound to 'form' state */}
          <button onClick={handleGenerate} className="w-full btn-primary py-4">Generate Brief</button>
        </div>
      ) : (
        <div className="space-y-6">
          <pre className="bg-black/60 p-6 rounded-xl text-stone-300 text-xs overflow-x-auto border border-white/10 whitespace-pre-wrap">{brief}</pre>
          
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => navigator.clipboard.writeText(brief)} className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-gold-500/20 transition"><Copy size={20} /> Copy</button>
            <button onClick={handleDownload} className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-gold-500/20 transition"><Download size={20} /> PDF</button>
            <button onClick={() => window.open(`https://wa.me/919676831437?text=${encodeURIComponent(brief)}`)} className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-green-500/20 transition"><MessageCircle size={20} /> WhatsApp</button>
          </div>
        </div>
      )}
    </div>
  );
                           }
            
