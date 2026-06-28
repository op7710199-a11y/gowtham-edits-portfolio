import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { calculateEstimate } from '../../utils/costEstimator';
import { Calculator, Loader2 } from 'lucide-react';
import { SectionHeading } from '../Reveal';

export function CostEstimator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', service: 'Instagram Reels Editing', duration: 1, complexity: 'Low', rush: false });

  const handleCalculate = async () => {
    setLoading(true);
    const estimate = calculateEstimate(form);
    
    await supabase.from("ai_requests").insert([{
      tool_type: "cost_estimator",
      name: form.name,
      email: form.email,
      service: form.service,
      estimated_price: estimate.price,
      status: "new",
    }]);

    setResult(estimate);
    setLoading(false);
  };

  return (
    <section id="estimator" className="section-padding">
      <div className="container-mx max-w-2xl">
        <SectionHeading eyebrow="AI TOOLS" title="Cost Estimator" subtitle="Get an instant quote for your project." />
        
        <div className="mt-8 rounded-3xl border border-gold-500/20 bg-white/[0.02] p-8 backdrop-blur-xl">
          {!result ? (
            <div className="space-y-4">
              <input type="text" placeholder="Name" className="w-full p-3 rounded-xl bg-black border border-white/10" onChange={(e) => setForm({...form, name: e.target.value})} />
              <input type="email" placeholder="Email" className="w-full p-3 rounded-xl bg-black border border-white/10" onChange={(e) => setForm({...form, email: e.target.value})} />
              <button onClick={handleCalculate} disabled={loading} className="w-full btn-primary py-4 mt-4">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Calculate Estimate"}
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-white">
              <div className="text-center">
                <div className="text-sm text-stone-400">Estimated Price</div>
                <div className="text-4xl font-bold text-gold-400">₹{result.price}</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Base</span><span>₹{result.breakdown.base}</span></div>
                <div className="flex justify-between"><span>Duration</span><span>₹{result.breakdown.durationCost}</span></div>
                <div className="flex justify-between"><span>Complexity</span><span>₹{result.breakdown.complexityCost}</span></div>
                <div className="flex justify-between border-t border-white/10 pt-2 font-bold"><span>Total</span><span>₹{result.price}</span></div>
              </div>
              <button onClick={() => setResult(null)} className="w-full text-xs text-stone-500">Calculate another</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
