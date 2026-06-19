/*
# Create inquiries table for GOWTHAM EDITS contact form

## Summary
Adds a single-tenant `inquiries` table that stores inquiries submitted from the
public contact form on the GOWTHAM EDITS portfolio site. This is a no-auth
public site (no sign-in), so visitor-submitted inquiries are written with the
anon key and only an INSERT policy is exposed publicly. Site owner can later
read/manage inquiries directly via the Supabase dashboard.

## New Tables
- `inquiries`
  - `id` (uuid, primary key)
  - `name` (text, not null) — submitter name
  - `email` (text, not null) — submitter email
  - `phone` (text) — optional phone / WhatsApp number
  - `service` (text) — requested service (e.g. Wedding Edit, Reels)
  - `message` (text, not null) — the inquiry message
  - `status` (text, default 'new') — workflow status for owner triage
  - `created_at` (timestamptz, default now())

## Security
- RLS ENABLED on `inquiries`.
- Public INSERT policy (`TO anon, authenticated`) so the contact form works
  without sign-in, restricted by `WITH CHECK (true)` because all submitted
  fields are intentionally public inquiry data.
- No public SELECT/UPDATE/DELETE — only the project owner (via dashboard /
  service role) can read or manage inquiries. This prevents scraping of inquiries.
- `USING (true)` is acceptable here because the data being written is the
  intentionally-public inquiry content submitted by the visitor.
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_inquiries" ON inquiries;
CREATE POLICY "public_insert_inquiries"
ON inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);
