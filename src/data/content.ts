export type IconName =
  | 'Film'
  | 'Heart'
  | 'Sun'
  | 'Bike'
  | 'Smartphone'
  | 'Youtube'
  | 'Palette'
  | 'Sparkles'
  | 'Wand2'
  | 'Users'
  | 'Award'
  | 'Clock'
  | 'CheckCircle'
  | 'MessageCircle'
  | 'Instagram'
  | 'Send'
  | 'ArrowUpRight';

export interface Service {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  includes: string[];
  idealFor: string;
  delivery: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  image: string;
  tag: string;
  featured?: boolean;
}

export type ProjectCategory =
  | 'Wedding'
  | 'Haldi'
  | 'Pre-Wedding'
  | 'Bike Shoots'
  | 'Reels'
  | 'Cinematic Edits'
  | 'Social Media Content';

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  bestFor: string;
  highlights: string[];
  delivery: string;
  featured?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export const CATEGORIES: ProjectCategory[] = [
  'Wedding',
  'Haldi',
  'Pre-Wedding',
  'Bike Shoots',
  'Reels',
  'Cinematic Edits',
  'Social Media Content',
];

export const STATS = [
  { value: 240, label: 'Projects Completed', suffix: '+' },
  { value: 180, label: 'Happy Clients', suffix: '+' },
  { value: 1200, label: 'Content Delivered', suffix: '+' },
];

export const SERVICES: Service[] = [
  {
    id: 'wedding',
    icon: 'Film',
    title: 'Wedding Video Editing',
    description: 'A breathtaking heirloom of your big day, edited with film-grade rhythm.',
    includes: ['Full ceremony film', 'Highlight trailer', 'Audio sync & vows edit', 'Color grade'],
    idealFor: 'Couples & families',
    delivery: '10–14 days',
  },
  {
    id: 'haldi',
    icon: 'Sun',
    title: 'Haldi Highlights',
    description: 'Vibrant, joyful cuts that capture every swirl of turmeric and laughter.',
    includes: ['Haldi highlight reel', 'Audio track sync', 'Slow-mo moments', 'Bright color grade'],
    idealFor: 'Pre-wedding events',
    delivery: '4–6 days',
  },
  {
    id: 'pre-wedding',
    icon: 'Heart',
    title: 'Pre-Wedding Cinematics',
    description: 'Storytelling films for the love before the vows — soft, romantic, timeless.',
    includes: ['Cinematic storyboard', 'Color matching', 'Music-driven edit', '4K master'],
    idealFor: 'Couples',
    delivery: '7–10 days',
  },
  {
    id: 'bike',
    icon: 'Bike',
    title: 'Bike Cinematic Editing',
    description: 'Adrenaline films — fast cuts, deep engine cuts, and cinematic landscapes.',
    includes: ['Cinematic color grade', 'Speed ramps', 'Sound design', 'Beat-synced cuts'],
    idealFor: 'Riders & bike enthusiasts',
    delivery: '4–7 days',
  },
  {
    id: 'reels',
    icon: 'Smartphone',
    title: 'Instagram Reels Editing',
    description: 'Scroll-stopping reels engineered for retention and shares.',
    includes: ['Trend-aware cuts', 'Beat-sync', 'Captions & stickers', 'Vertical 9:16 master'],
    idealFor: 'Creators & brands',
    delivery: '24–48 hrs',
  },
  {
    id: 'youtube',
    icon: 'Youtube',
    title: 'YouTube Video Editing',
    description: 'Watch-time optimized long-form edits with clean pacing and retention hooks.',
    includes: ['Punchy intro & thumbnails', 'B-roll integration', 'Audio cleanup', 'Subtitle pass'],
    idealFor: 'Creators & storytellers',
    delivery: '5–7 days',
  },
  {
    id: 'color',
    icon: 'Palette',
    title: 'Color Grading',
    description: 'Film-grade color science that gives every frame a signature mood.',
    includes: ['Shot matching', 'Creative LUTs', 'Skin tone protection', 'HDR-ready export'],
    idealFor: 'Filmmakers & brands',
    delivery: '2–4 days',
  },
  {
    id: 'motion',
    icon: 'Sparkles',
    title: 'Motion Graphics',
    description: 'Animated titles, transitions, and lower thirds that elevate every scene.',
    includes: ['Animated titles', 'Lower thirds', 'Seamless transitions', 'Logo stinger'],
    idealFor: 'Brands & creators',
    delivery: '3–5 days',
  },
  {
    id: 'custom',
    icon: 'Wand2',
    title: 'Custom Editing Services',
    description: 'Have a unique vision? Let us craft a one-of-a-kind edit built around it.',
    includes: ['Discovery call', 'Bespoke direction', 'Multi-format deliverables', 'Unlimited revisions'],
    idealFor: 'Unique projects',
    delivery: 'Varies',
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Eternal Vows — Sneha & Arjun',
    category: 'Wedding',
    image: 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Wedding Film',
    featured: true,
  },
  {
    id: 'p2',
    title: 'Golden Haldi Warmth',
    category: 'Haldi',
    image: 'https://images.pexels.com/photos/1024992/pexels-photo-1024992.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Haldi Highlights',
    featured: true,
  },
  {
    id: 'p3',
    title: 'Mountain Promise — Pre-Wedding',
    category: 'Pre-Wedding',
    image: 'https://images.pexels.com/photos/3035578/pexels-photo-3035578.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Pre-Wedding Film',
    featured: true,
  },
  {
    id: 'p4',
    title: 'Chrome & Thunder — KTM',
    category: 'Bike Shoots',
    image: 'https://images.pexels.com/photos/2111596/pexels-photo-2111596.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Bike Cinematic',
    featured: true,
  },
  {
    id: 'p5',
    title: 'City Lights Reel',
    category: 'Reels',
    image: 'https://images.pexels.com/photos/3734822/pexels-photo-3734822.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Instagram Reel',
  },
  {
    id: 'p6',
    title: 'Cinematic Café',
    category: 'Cinematic Edits',
    image: 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Cinematic Short',
    featured: true,
  },
  {
    id: 'p7',
    title: 'Festive Branded Content',
    category: 'Social Media Content',
    image: 'https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Social Content',
  },
  {
    id: 'p8',
    title: 'Vows Under Stars',
    category: 'Wedding',
    image: 'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Wedding Film',
  },
  {
    id: 'p9',
    title: 'Rain-soaked Streets',
    category: 'Cinematic Edits',
    image: 'https://images.pexels.com/photos/1308747/pexels-photo-1308747.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Cinematic Short',
  },
  {
    id: 'p10',
    title: 'Twilight Ride',
    category: 'Bike Shoots',
    image: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Bike Cinematic',
  },
  {
    id: 'p11',
    title: 'Garden Engagement',
    category: 'Pre-Wedding',
    image: 'https://images.pexels.com/photos/3035554/pexels-photo-3035554.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Pre-Wedding',
  },
  {
    id: 'p12',
    title: 'Brand Launch Reel',
    category: 'Reels',
    image: 'https://images.pexels.com/photos/3334495/pexels-photo-3334495.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    tag: 'Instagram Reel',
  },
];

export const REEL_FEED = [
  { id: 'r1', image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=450&h=600&fit=crop', caption: 'Wedding teaser reel' },
  { id: 'r2', image: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=450&h=600&fit=crop', caption: 'Riding through monsoon' },
  { id: 'r3', image: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=450&h=600&fit=crop', caption: 'Haldi color edit' },
  { id: 'r4', image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=450&h=600&fit=crop', caption: 'Couple portrait reel' },
  { id: 'r5', image: 'https://images.pexels.com/photos/1696773/pexels-photo-1696773.jpeg?auto=compress&cs=tinysrgb&w=450&h=600&fit=crop', caption: 'Night street cinematic' },
  { id: 'r6', image: 'https://images.pexels.com/photos/1769524/pexels-photo-1769524.jpeg?auto=compress&cs=tinysrgb&w=450&h=600&fit=crop', caption: 'Rustic love story' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sneha & Arjun',
    role: 'Wedding • Bengaluru',
    avatar: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
    rating: 5,
    text: 'Gowtham turned our raw wedding footage into a film my parents cried watching. Every beat was perfectly timed.',
  },
  {
    name: 'Karthik R',
    role: 'Bike Enthusiast',
    avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
    rating: 5,
    text: 'My KTM video went viral. The speed ramps and engine sound design made it feel like a movie trailer.',
  },
  {
    name: 'Divya Lakshmi',
    role: 'Content Creator',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
    rating: 5,
    text: 'Reels delivery was faster than any editor I used before — and they actually understood the trends.',
  },
  {
    name: 'Vikram & Aishu',
    role: 'Pre-Wedding • Ooty',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
    rating: 5,
    text: 'The pre-wedding film felt like a short movie. Gowtham understood our story and made it visual.',
  },
  {
    name: 'Nandini S',
    role: 'Event Planner',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
    rating: 5,
    text: 'I now recommend GOWTHAM EDITS to every client. Reliable, professional, and genuinely cinematic output.',
  },
  {
    name: 'Rohit Verma',
    role: 'YouTuber',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop',
    rating: 5,
    text: 'Retention on my channel jumped overnight after switching the editor. Worth every rupee.',
  },
];

export const PRICING: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹4,999',
    cadence: 'per edit',
    bestFor: 'Reels & short-form content',
    highlights: ['1 reel or short edit', 'Beat-sync & trend aware', 'Captions included', '2 revisions', '3 day delivery'],
    delivery: 'MP4 vertical 9:16',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹14,999',
    cadence: 'per project',
    bestFor: 'Weddings & cinematic films',
    highlights: ['Full highlight film', 'Cinematic color grade', 'Audio sync & cleanup', 'Sound design pass', '5 revisions', '7–10 day delivery'],
    delivery: '4K MP4 + vertical reel cut',
    featured: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 'Let\'s talk',
    cadence: 'tailored scope',
    bestFor: 'Multi-format & brand work',
    highlights: ['Discovery call first', 'Multi-format deliverables', 'Motion graphics & titles', 'Unlimited revisions', 'Priority timeline'],
    delivery: 'Flexible deliverables',
  },
];

export const FAQS: FaqItem[] = [
  {
    question: 'What type of edits do you make?',
    answer: 'Wedding films, haldi highlights, pre-wedding cinematics, bike cinematic edits, Instagram reels, YouTube edits, color grading, motion graphics, and full custom editing builds. If it can be filmed, I can turn it into a cinematic memory.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard reels ship within 24–48 hours. Highlight films take 4–7 days. Full wedding and cinematic projects typically take 7–14 days. Rush editing is available on request with a priority fee.',
  },
  {
    question: 'Can I request revisions?',
    answer: 'Yes. Every package includes revisions. Starter gets 2, Premium gets 5, and Custom projects include unlimited revisions until you are happy with the final cut.',
  },
  {
    question: 'Do you handle weddings, haldi, and reels together?',
    answer: 'Absolutely. Full-event packages bundle wedding films, haldi highlights, and vertical reel cuts together — so you get one cohesive story delivered across every format you need.',
  },
  {
    question: 'How do I send my footage?',
    answer: 'Upload via Google Drive, WeTransfer, or Dropbox — anything that handles large files. I will send a simple intake checklist after you reach out so you know exactly what to prepare.',
  },
  {
    question: 'What software do you use?',
    answer: 'Adobe Premiere Pro, After Effects, DaVinci Resolve for color grading, and pro audio tools. The right tool for the job, every time. Output is always delivered in your preferred format.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Share Footage',
    description: 'Upload your raw clips through Drive or Dropbox. I send an intake checklist so nothing gets missed.',
  },
  {
    step: '02',
    title: 'Editing Begins',
    description: 'A draft edit starts — pacing, color, sound design. You get early looks so the vision aligns from day one.',
  },
  {
    step: '03',
    title: 'Review & Revisions',
    description: 'You review the cut and request tweaks. We refine together until every frame feels right.',
  },
  {
    step: '04',
    title: 'Final Delivery',
    description: 'You receive the polished master in every format you need — vertical, square, 4K, and web-ready.',
  },
];

export const TOOLS = [
  'Adobe Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Photoshop',
  'Audition',
  'Final Cut Pro',
];

export const WHY_CHOOSE = [
  {
    icon: 'Film' as IconName,
    title: 'Cinematic by default',
    description: 'Every edit is graded and paced like a film — never a slideshow, never a template.',
  },
  {
    icon: 'Clock' as IconName,
    title: 'Faster turnaround',
    description: 'Reels in 48 hours. Films in 10. I respect your timeline and keep you posted at every step.',
  },
  {
    icon: 'Users' as IconName,
    title: 'Built around your story',
    description: 'No two edits look the same. Your moments dictate the cut — not the other way around.',
  },
  {
    icon: 'Award' as IconName,
    title: 'Trusted by clients',
    description: '240+ projects delivered to couples, creators, and riders across India and beyond.',
  },
];

export const INSTAGRAM_HANDLE = 'gowtham.edits1';
export const INSTAGRAM_URL = 'https://www.instagram.com/gowtham.edits1';
export const WHATSAPP_NUMBER = '9676831437';
export const WHATSAPP_DISPLAY = '+91 96768 31437';
export const EMAIL = 'gowthamedits37@gmail.com';
export const LOCATION = 'Hyderabad, Telangana, India, Worldwide';
