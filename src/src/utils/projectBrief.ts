export function generateBrief(data: {
  service: string;
  style: string;
  mood: string;
  duration: string;
  platform: string;
}) {
  return `
PROJECT BRIEF

Service:
${data.service}

Editing Style:
${data.style}

Mood:
${data.mood}

Target Platform:
${data.platform}

Final Duration:
${data.duration}

Checklist

✓ Cinematic Color Grading
✓ Smooth Transitions
✓ Beat Sync
✓ Audio Enhancement
✓ Motion Graphics
✓ Export in 4K

Recommended Delivery:
5 Business Days
`;
}
