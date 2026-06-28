export function recommendPackage({
  service,
  budget,
  duration,
  delivery,
}: {
  service: string;
  budget: number;
  duration: number;
  delivery: string;
}) {
  let packageName = "Basic";
  let score = 0;

  if (budget >= 10000) score += 3;
  else if (budget >= 5000) score += 2;
  else score += 1;

  if (duration >= 10) score += 2;
  if (delivery === "Rush") score += 2;

  if (
    service.includes("Wedding") ||
    service.includes("Pre-Wedding")
  ) {
    score += 2;
  }

  if (score >= 7) packageName = "Premium";
  else if (score >= 4) packageName = "Standard";

  return {
    package: packageName,
    score,
  };
}
