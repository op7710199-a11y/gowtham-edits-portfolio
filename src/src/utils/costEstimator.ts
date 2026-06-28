export function calculateEstimate({
  service,
  duration,
  complexity,
  rush,
}: {
  service: string;
  duration: number;
  complexity: string;
  rush: boolean;
}) {
  let base = 0;

  // Pricing Logic
  switch (service) {
    case "Wedding Video Editing": base = 8000; break;
    case "Haldi Highlights": base = 4000; break;
    case "Pre-Wedding Cinematics": base = 6000; break;
    case "Instagram Reels Editing": base = 1200; break;
    case "Bike Cinematic Editing": base = 2500; break;
    default: base = 3000;
  }

  const durationCost = duration * 250;
  const complexityCost = complexity === "High" ? 5000 : complexity === "Medium" ? 2000 : 0;
  const rushCost = rush ? 3000 : 0;

  const total = base + durationCost + complexityCost + rushCost;

  // Package Recommendation
  const packageName = total < 3000 ? "Basic" : total < 8000 ? "Standard" : "Premium";

  return {
    price: total,
    hours: Math.ceil(total / 600),
    delivery: rush ? "24-48 Hours" : "3-7 Days",
    packageName,
    breakdown: {
      base,
      durationCost,
      complexityCost,
      rushCost
    }
  };
}
