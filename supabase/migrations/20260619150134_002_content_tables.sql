/*
# Content Tables: Services, Pricing, Portfolio, Testimonials, FAQs, Site Settings, SEO, Activity Logs

## Summary
Creates all database-backed content tables for the GOWTHAM EDITS admin system.
These replace the hardcoded content.ts file and allow super_admin/admin/editor
to manage all website content from the admin dashboard.

## New Tables

### services
Stores the 9 video editing services displayed on the public website.
- title, description, icon (key for Icon component), features (jsonb array of strings)
- display_order, is_published — control order and visibility on public site
- ideal_for — short text (e.g. "Couples & families")
- delivery_time — e.g. "7–10 days"

### pricing_tiers
Stores Starter, Premium, Custom pricing packages.
- name, price_label (e.g. "₹14,999"), period (e.g. "per project")
- description, features (jsonb array), delivery_note
- is_popular flag (featured/highlighted card), display_order, is_published

### portfolio_items
Stores all portfolio gallery entries.
- title, category (Wedding/Haldi/Pre-Wedding/Bike Shoots/Reels/Cinematic Edits/Social Media Content)
- description, thumbnail_url, video_url (optional), tags (jsonb)
- is_featured, is_published, display_order

### testimonials
Client reviews shown on the public site.
- client_name, client_role (e.g. "Wedding client, Bengaluru")
- avatar_url, rating (1–5), content
- display_order, is_published

### faqs
Frequently asked questions shown in FAQ accordion.
- question, answer, display_order, is_published

### site_settings
Key/value store for general site-wide settings managed by super_admin.
- key (unique), value (jsonb), label (human-readable), category, updated_at

### seo_settings
Per-page SEO configuration.
- page_path (unique), meta_title, meta_description, og_image_url, keywords (jsonb)

### activity_logs
Immutable audit trail of all admin actions.
- user_id (FK to profiles), action, entity, entity_id, details (jsonb)

## Security
- RLS enabled on all tables.
- Published content is publicly readable (anon + authenticated).
- Unpublished content is only visible to staff.
- Staff (any active admin role) can INSERT and UPDATE content tables.
- Only admin+ can DELETE from content tables.
- site_settings and seo_settings mutations restricted to super_admin.
- activity_logs: staff can INSERT; no UPDATE or DELETE allowed.

## Indexes
Performance indexes on frequently queried columns.
*/

-- ==================== services ====================
CREATE TABLE IF NOT EXISTS services (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  description  text,
  icon         text DEFAULT 'Film',
  features     jsonb NOT NULL DEFAULT '[]'::jsonb,
  ideal_for    text DEFAULT '',
  delivery_time text DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services_select_public" ON services;
CREATE POLICY "services_select_public" ON services FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_staff());

DROP POLICY IF EXISTS "services_insert_staff" ON services;
CREATE POLICY "services_insert_staff" ON services FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "services_update_staff" ON services;
CREATE POLICY "services_update_staff" ON services FOR UPDATE
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "services_delete_admin" ON services;
CREATE POLICY "services_delete_admin" ON services FOR DELETE
  TO authenticated USING (public.is_admin());

-- ==================== pricing_tiers ====================
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  price_label   text NOT NULL DEFAULT '₹0',
  period        text NOT NULL DEFAULT 'per project',
  description   text,
  features      jsonb NOT NULL DEFAULT '[]'::jsonb,
  delivery_note text DEFAULT '',
  is_popular    boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pricing_select_public" ON pricing_tiers;
CREATE POLICY "pricing_select_public" ON pricing_tiers FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_staff());

DROP POLICY IF EXISTS "pricing_insert_staff" ON pricing_tiers;
CREATE POLICY "pricing_insert_staff" ON pricing_tiers FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "pricing_update_staff" ON pricing_tiers;
CREATE POLICY "pricing_update_staff" ON pricing_tiers FOR UPDATE
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "pricing_delete_admin" ON pricing_tiers;
CREATE POLICY "pricing_delete_admin" ON pricing_tiers FOR DELETE
  TO authenticated USING (public.is_admin());

-- ==================== portfolio_items ====================
CREATE TABLE IF NOT EXISTS portfolio_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  category      text NOT NULL,
  description   text,
  thumbnail_url text NOT NULL DEFAULT '',
  video_url     text,
  tags          jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_featured   boolean NOT NULL DEFAULT false,
  is_published  boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio_select_public" ON portfolio_items;
CREATE POLICY "portfolio_select_public" ON portfolio_items FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_staff());

DROP POLICY IF EXISTS "portfolio_insert_staff" ON portfolio_items;
CREATE POLICY "portfolio_insert_staff" ON portfolio_items FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "portfolio_update_staff" ON portfolio_items;
CREATE POLICY "portfolio_update_staff" ON portfolio_items FOR UPDATE
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "portfolio_delete_admin" ON portfolio_items;
CREATE POLICY "portfolio_delete_admin" ON portfolio_items FOR DELETE
  TO authenticated USING (public.is_admin());

-- ==================== testimonials ====================
CREATE TABLE IF NOT EXISTS testimonials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name   text NOT NULL,
  client_role   text,
  avatar_url    text,
  rating        int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  content       text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_select_public" ON testimonials;
CREATE POLICY "testimonials_select_public" ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_staff());

DROP POLICY IF EXISTS "testimonials_insert_staff" ON testimonials;
CREATE POLICY "testimonials_insert_staff" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "testimonials_update_staff" ON testimonials;
CREATE POLICY "testimonials_update_staff" ON testimonials FOR UPDATE
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "testimonials_delete_admin" ON testimonials;
CREATE POLICY "testimonials_delete_admin" ON testimonials FOR DELETE
  TO authenticated USING (public.is_admin());

-- ==================== faqs ====================
CREATE TABLE IF NOT EXISTS faqs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question      text NOT NULL,
  answer        text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faqs_select_public" ON faqs;
CREATE POLICY "faqs_select_public" ON faqs FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_staff());

DROP POLICY IF EXISTS "faqs_insert_staff" ON faqs;
CREATE POLICY "faqs_insert_staff" ON faqs FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "faqs_update_staff" ON faqs;
CREATE POLICY "faqs_update_staff" ON faqs FOR UPDATE
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "faqs_delete_admin" ON faqs;
CREATE POLICY "faqs_delete_admin" ON faqs FOR DELETE
  TO authenticated USING (public.is_admin());

-- ==================== site_settings ====================
CREATE TABLE IF NOT EXISTS site_settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text UNIQUE NOT NULL,
  value      jsonb NOT NULL DEFAULT 'null'::jsonb,
  label      text,
  category   text DEFAULT 'general',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_select_staff" ON site_settings;
CREATE POLICY "site_settings_select_staff" ON site_settings FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "site_settings_insert_superadmin" ON site_settings;
CREATE POLICY "site_settings_insert_superadmin" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "site_settings_update_superadmin" ON site_settings;
CREATE POLICY "site_settings_update_superadmin" ON site_settings FOR UPDATE
  TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "site_settings_delete_superadmin" ON site_settings;
CREATE POLICY "site_settings_delete_superadmin" ON site_settings FOR DELETE
  TO authenticated USING (public.is_super_admin());

-- ==================== seo_settings ====================
CREATE TABLE IF NOT EXISTS seo_settings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path        text UNIQUE NOT NULL,
  meta_title       text,
  meta_description text,
  og_image_url     text,
  keywords         jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_settings_select_staff" ON seo_settings;
CREATE POLICY "seo_settings_select_staff" ON seo_settings FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "seo_settings_insert_superadmin" ON seo_settings;
CREATE POLICY "seo_settings_insert_superadmin" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "seo_settings_update_superadmin" ON seo_settings;
CREATE POLICY "seo_settings_update_superadmin" ON seo_settings FOR UPDATE
  TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "seo_settings_delete_superadmin" ON seo_settings;
CREATE POLICY "seo_settings_delete_superadmin" ON seo_settings FOR DELETE
  TO authenticated USING (public.is_super_admin());

-- ==================== activity_logs ====================
CREATE TABLE IF NOT EXISTS activity_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action     text NOT NULL,
  entity     text NOT NULL,
  entity_id  uuid,
  details    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_logs_select_staff" ON activity_logs;
CREATE POLICY "activity_logs_select_staff" ON activity_logs FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "activity_logs_insert_staff" ON activity_logs;
CREATE POLICY "activity_logs_insert_staff" ON activity_logs FOR INSERT
  TO authenticated WITH CHECK (public.is_staff());

-- ==================== inquiries: add status column ====================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inquiries' AND column_name = 'status'
  ) THEN
    ALTER TABLE inquiries ADD COLUMN status text NOT NULL DEFAULT 'new';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inquiries' AND column_name = 'notes'
  ) THEN
    ALTER TABLE inquiries ADD COLUMN notes text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inquiries' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE inquiries ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END;
$$;

-- Staff can now read inquiries (admin management)
DROP POLICY IF EXISTS "inquiries_select_staff" ON inquiries;
CREATE POLICY "inquiries_select_staff" ON inquiries FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "inquiries_update_admin" ON inquiries;
CREATE POLICY "inquiries_update_admin" ON inquiries FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "inquiries_delete_admin" ON inquiries;
CREATE POLICY "inquiries_delete_admin" ON inquiries FOR DELETE
  TO authenticated USING (public.is_admin());

-- ==================== Performance Indexes ====================
CREATE INDEX IF NOT EXISTS idx_portfolio_order ON portfolio_items(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_pricing_order ON pricing_tiers(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
