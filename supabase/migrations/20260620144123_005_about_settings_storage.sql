/*
# About Section — Admin-Editable Profile, Bio, Skills, Quote, CTA

## Summary
Adds a fully admin-editable About section with:
1. about_settings — single-row table: profile image URL, name, title, bio, skills, quote, Instagram link, CTA text
2. Storage bucket 'about-assets' for profile image uploads
3. RLS policies: public SELECT, admin INSERT/UPDATE
4. Seed with placeholder data
*/

-- ==================== about_settings ====================
CREATE TABLE IF NOT EXISTS about_settings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_image_url text NOT NULL DEFAULT '',
  name            text NOT NULL DEFAULT 'Gowtham',
  title           text NOT NULL DEFAULT 'Cinematic Video Editor',
  bio             text NOT NULL DEFAULT 'I''m a cinematic video editor specializing in weddings, haldi celebrations, pre-wedding stories, bike cinematic cuts, and high-retention reels & social content. My approach is simple: story first, rhythm second, polish always.',
  skills          jsonb NOT NULL DEFAULT '["DaVinci Resolve","Premiere Pro","After Effects","Color Grading","Sound Design","Motion Graphics"]'::jsonb,
  quote           text NOT NULL DEFAULT 'Every frame tells a story. Every cut moves it forward.',
  quote_author    text NOT NULL DEFAULT 'Gowtham',
  instagram_url   text NOT NULL DEFAULT '',
  cta_text        text NOT NULL DEFAULT 'Let''s Work Together',
  is_published    boolean NOT NULL DEFAULT true,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_select_public" ON about_settings;
CREATE POLICY "about_select_public" ON about_settings FOR SELECT
  TO anon, authenticated USING (is_published = true OR public.is_staff());

DROP POLICY IF EXISTS "about_insert_admin" ON about_settings;
CREATE POLICY "about_insert_admin" ON about_settings FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "about_update_admin" ON about_settings;
CREATE POLICY "about_update_admin" ON about_settings FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Seed default row with placeholder content
INSERT INTO about_settings (
  profile_image_url, name, title, bio, skills, quote, quote_author, instagram_url, cta_text
) VALUES (
  '',
  'Gowtham',
  'Cinematic Video Editor',
  'I''m a cinematic video editor specializing in weddings, haldi celebrations, pre-wedding stories, bike cinematic cuts, and high-retention reels & social content. My approach is simple: story first, rhythm second, polish always. The result is films that feel less like highlight reels and more like a memory you''d want to replay forever.',
  '["DaVinci Resolve","Premiere Pro","After Effects","Color Grading","Sound Design","Motion Graphics"]'::jsonb,
  'Every frame tells a story. Every cut moves it forward.',
  'Gowtham',
  '',
  'Let''s Work Together'
) ON CONFLICT DO NOTHING;

-- ==================== Storage bucket for about assets ====================
INSERT INTO storage.buckets (id, name, public)
VALUES ('about-assets', 'about-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: public read, admin write
DROP POLICY IF EXISTS "about_assets_read_public" ON storage.objects;
CREATE POLICY "about_assets_read_public" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'about-assets');

DROP POLICY IF EXISTS "about_assets_write_admin" ON storage.objects;
CREATE POLICY "about_assets_write_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'about-assets' AND public.is_admin());

DROP POLICY IF EXISTS "about_assets_update_admin" ON storage.objects;
CREATE POLICY "about_assets_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'about-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'about-assets' AND public.is_admin());

DROP POLICY IF EXISTS "about_assets_delete_admin" ON storage.objects;
CREATE POLICY "about_assets_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'about-assets' AND public.is_admin());

-- Index
CREATE INDEX IF NOT EXISTS idx_about_updated ON about_settings(updated_at);
