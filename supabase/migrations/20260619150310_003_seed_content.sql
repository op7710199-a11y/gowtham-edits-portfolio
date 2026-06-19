/*
# Seed Content: Services, Pricing, Portfolio, Testimonials, FAQs, Site Settings, SEO Settings

## Summary
Seeds all content tables with the GOWTHAM EDITS brand content that was previously
hardcoded in content.ts. This makes the content immediately available on the public
site and in the admin dashboard for editing. All seed data reflects the brand's
actual service offering.

## Seeded Tables
- services (9 rows)
- pricing_tiers (3 rows: Starter, Premium, Custom)
- portfolio_items (12 rows across 7 categories)
- testimonials (6 rows)
- faqs (6 rows)
- site_settings (brand info, social links, contact details)
- seo_settings (homepage SEO defaults)

## Notes
- Uses INSERT ... ON CONFLICT DO NOTHING so this migration is safe to re-run.
- All rows default to is_published = true.
- display_order controls the order on the public site.
*/

-- ==================== SERVICES ====================
INSERT INTO services (title, description, icon, features, ideal_for, delivery_time, display_order) VALUES
  ('Wedding Video Editing', 'A breathtaking heirloom of your big day, edited with film-grade rhythm.', 'Film', '["Full ceremony film", "Highlight trailer", "Audio sync & vows edit", "Color grade"]', 'Couples & families', '10–14 days', 1),
  ('Haldi Highlights', 'Vibrant, joyful cuts that capture every swirl of turmeric and laughter.', 'Sun', '["Haldi highlight reel", "Audio track sync", "Slow-mo moments", "Bright color grade"]', 'Pre-wedding events', '4–6 days', 2),
  ('Pre-Wedding Cinematics', 'Storytelling films for the love before the vows — soft, romantic, timeless.', 'Heart', '["Cinematic storyboard", "Color matching", "Music-driven edit", "4K master"]', 'Couples', '7–10 days', 3),
  ('Bike Cinematic Editing', 'Adrenaline films — fast cuts, deep engine cuts, and cinematic landscapes.', 'Bike', '["Cinematic color grade", "Speed ramps", "Sound design", "Beat-synced cuts"]', 'Riders & bike enthusiasts', '4–7 days', 4),
  ('Instagram Reels Editing', 'Scroll-stopping reels engineered for retention and shares.', 'Smartphone', '["Trend-aware cuts", "Beat-sync", "Captions & stickers", "Vertical 9:16 master"]', 'Creators & brands', '24–48 hrs', 5),
  ('YouTube Video Editing', 'Watch-time optimized long-form edits with clean pacing and retention hooks.', 'Youtube', '["Punchy intro & thumbnails", "B-roll integration", "Audio cleanup", "Subtitle pass"]', 'Creators & storytellers', '5–7 days', 6),
  ('Color Grading', 'Film-grade color science that gives every frame a signature mood.', 'Palette', '["Shot matching", "Creative LUTs", "Skin tone protection", "HDR-ready export"]', 'Filmmakers & brands', '2–4 days', 7),
  ('Motion Graphics', 'Animated titles, transitions, and lower thirds that elevate every scene.', 'Sparkles', '["Animated titles", "Lower thirds", "Seamless transitions", "Logo stinger"]', 'Brands & creators', '3–5 days', 8),
  ('Custom Editing Services', 'Have a unique vision? Let us craft a one-of-a-kind edit built around it.', 'Wand2', '["Discovery call", "Bespoke direction", "Multi-format deliverables", "Unlimited revisions"]', 'Unique projects', 'Varies', 9)
ON CONFLICT DO NOTHING;

-- ==================== PRICING TIERS ====================
INSERT INTO pricing_tiers (name, price_label, period, description, features, delivery_note, is_popular, display_order) VALUES
  ('Starter', '₹4,999', 'per edit', 'Perfect starting point for reels and short-form content creators.', '["1 reel or short edit", "Beat-sync & trend aware", "Captions included", "2 revisions", "3 day delivery"]', 'MP4 vertical 9:16', false, 1),
  ('Premium', '₹14,999', 'per project', 'The full cinematic treatment for weddings and milestone events.', '["Full highlight film", "Cinematic color grade", "Audio sync & cleanup", "Sound design pass", "5 revisions", "7–10 day delivery"]', '4K MP4 + vertical reel cut', true, 2),
  ('Custom', 'Let us talk', 'tailored scope', 'Bespoke packages for multi-format, brand, or complex projects.', '["Discovery call first", "Multi-format deliverables", "Motion graphics & titles", "Unlimited revisions", "Priority timeline"]', 'Flexible deliverables', false, 3)
ON CONFLICT DO NOTHING;

-- ==================== PORTFOLIO ITEMS ====================
INSERT INTO portfolio_items (title, category, description, thumbnail_url, is_featured, display_order) VALUES
  ('Eternal Vows — Sneha & Arjun', 'Wedding', 'A cinematic wedding film capturing every emotion.', 'https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', true, 1),
  ('Golden Haldi Warmth', 'Haldi', 'Vibrant haldi ceremony highlights.', 'https://images.pexels.com/photos/1024992/pexels-photo-1024992.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', true, 2),
  ('Mountain Promise — Pre-Wedding', 'Pre-Wedding', 'A romantic pre-wedding story in the mountains.', 'https://images.pexels.com/photos/3035578/pexels-photo-3035578.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', true, 3),
  ('Chrome & Thunder — KTM', 'Bike Shoots', 'High-octane KTM cinematic film.', 'https://images.pexels.com/photos/2111596/pexels-photo-2111596.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', true, 4),
  ('City Lights Reel', 'Reels', 'Trending city lifestyle reel.', 'https://images.pexels.com/photos/3734822/pexels-photo-3734822.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', false, 5),
  ('Cinematic Cafe Short', 'Cinematic Edits', 'Moody cinematic short film at a cafe.', 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', true, 6),
  ('Festive Branded Content', 'Social Media Content', 'Festive brand campaign video.', 'https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', false, 7),
  ('Vows Under Stars', 'Wedding', 'Night-time wedding film with fairy lights.', 'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', false, 8),
  ('Rain-soaked Streets', 'Cinematic Edits', 'Monsoon cinematic short.', 'https://images.pexels.com/photos/1308747/pexels-photo-1308747.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', false, 9),
  ('Twilight Ride', 'Bike Shoots', 'Golden-hour motorcycle ride.', 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', false, 10),
  ('Garden Engagement', 'Pre-Wedding', 'Garden engagement shoot film.', 'https://images.pexels.com/photos/3035554/pexels-photo-3035554.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', false, 11),
  ('Brand Launch Reel', 'Reels', 'Product launch reel for Instagram.', 'https://images.pexels.com/photos/3334495/pexels-photo-3334495.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop', false, 12)
ON CONFLICT DO NOTHING;

-- ==================== TESTIMONIALS ====================
INSERT INTO testimonials (client_name, client_role, avatar_url, rating, content, display_order) VALUES
  ('Sneha & Arjun', 'Wedding • Bengaluru', 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop', 5, 'Gowtham turned our raw wedding footage into a film my parents cried watching. Every beat was perfectly timed.', 1),
  ('Karthik R', 'Bike Enthusiast', 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop', 5, 'My KTM video went viral. The speed ramps and engine sound design made it feel like a movie trailer.', 2),
  ('Divya Lakshmi', 'Content Creator', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop', 5, 'Reels delivery was faster than any editor I used before — and they actually understood the trends.', 3),
  ('Vikram & Aishu', 'Pre-Wedding • Ooty', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop', 5, 'The pre-wedding film felt like a short movie. Gowtham understood our story and made it visual.', 4),
  ('Nandini S', 'Event Planner', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop', 5, 'I now recommend GOWTHAM EDITS to every client. Reliable, professional, and genuinely cinematic output.', 5),
  ('Rohit Verma', 'YouTuber', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop', 5, 'Retention on my channel jumped overnight after switching the editor. Worth every rupee.', 6)
ON CONFLICT DO NOTHING;

-- ==================== FAQS ====================
INSERT INTO faqs (question, answer, display_order) VALUES
  ('What type of edits do you make?', 'Wedding films, haldi highlights, pre-wedding cinematics, bike cinematic edits, Instagram reels, YouTube edits, color grading, motion graphics, and full custom editing builds. If it can be filmed, I can turn it into a cinematic memory.', 1),
  ('How long does delivery take?', 'Standard reels ship within 24–48 hours. Highlight films take 4–7 days. Full wedding and cinematic projects typically take 7–14 days. Rush editing is available on request with a priority fee.', 2),
  ('Can I request revisions?', 'Yes. Every package includes revisions. Starter gets 2, Premium gets 5, and Custom projects include unlimited revisions until you are happy with the final cut.', 3),
  ('Do you handle weddings, haldi, and reels together?', 'Absolutely. Full-event packages bundle wedding films, haldi highlights, and vertical reel cuts together — so you get one cohesive story delivered across every format you need.', 4),
  ('How do I send my footage?', 'Upload via Google Drive, WeTransfer, or Dropbox — anything that handles large files. I will send a simple intake checklist after you reach out so you know exactly what to prepare.', 5),
  ('What software do you use?', 'Adobe Premiere Pro, After Effects, DaVinci Resolve for color grading, and pro audio tools. The right tool for the job, every time. Output is always delivered in your preferred format.', 6)
ON CONFLICT DO NOTHING;

-- ==================== SITE SETTINGS ====================
INSERT INTO site_settings (key, value, label, category) VALUES
  ('brand_name', '"GOWTHAM EDITS"', 'Brand Name', 'branding'),
  ('brand_tagline', '"Turning Moments Into Cinematic Memories"', 'Tagline', 'branding'),
  ('instagram_handle', '"gowtham.edits1"', 'Instagram Handle', 'social'),
  ('instagram_url', '"https://www.instagram.com/gowtham.edits1"', 'Instagram URL', 'social'),
  ('whatsapp_number', '"XXXXXXXXXX"', 'WhatsApp Number (digits only)', 'contact'),
  ('whatsapp_display', '"+91 90000 00000"', 'WhatsApp Display', 'contact'),
  ('email', '"hello@gowthamedits.com"', 'Email Address', 'contact'),
  ('location', '"Bengaluru, India • Worldwide remote"', 'Location', 'contact'),
  ('projects_count', '240', 'Projects Completed', 'stats'),
  ('clients_count', '180', 'Happy Clients', 'stats'),
  ('content_count', '1200', 'Content Delivered', 'stats')
ON CONFLICT (key) DO NOTHING;

-- ==================== SEO SETTINGS ====================
INSERT INTO seo_settings (page_path, meta_title, meta_description, og_image_url, keywords) VALUES
  ('/', 'GOWTHAM EDITS | Cinematic Video Editor — Weddings, Reels & Bike Films', 'GOWTHAM EDITS — Turning moments into cinematic memories. Premium video editing for weddings, haldi, pre-wedding, bike cinematic edits, Instagram reels & social media content.', 'https://images.pexels.com/photos/3014019/pexels-photo-3014019.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop', '["video editor", "wedding editing", "haldi edits", "pre-wedding cinematic", "bike cinematic", "Instagram reels", "GOWTHAM EDITS"]')
ON CONFLICT (page_path) DO NOTHING;
