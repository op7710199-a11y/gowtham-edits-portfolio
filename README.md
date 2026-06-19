# GOWTHAM EDITS — Premium Cinematic Portfolio

A production-ready portfolio website for **GOWTHAM EDITS**, a professional video editing brand based in India. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (luxury black & gold theme)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Routing:** React Router v6
- **Icons:** Lucide React

## Features

### Public Site
- Hero with logo, stats, and CTAs
- Database-driven services, pricing, portfolio, testimonials, FAQs
- Filterable portfolio gallery with lightbox
- Contact form → Supabase inquiries table
- WhatsApp floating CTA
- Full SEO (meta, OG, Twitter cards, sitemap, robots.txt)

### Admin Dashboard (`/admin`)
- **Super Admin:** Full access — users, settings, all content
- **Admin:** Portfolio, services, pricing, testimonials, inquiries, FAQs
- **Editor:** Portfolio uploads only
- Inquiry management with status tracking (New → Contacted → Converted → Closed)
- Activity log (immutable audit trail)
- Site settings key/value editor

## Database

All migrations are in `supabase/migrations/`. Apply them via the Supabase MCP tool or dashboard SQL editor.

## First Super Admin Setup

1. Go to Supabase Dashboard → Authentication → Users → Add User
2. Enter email + password
3. Run in SQL Editor:
   ```sql
   UPDATE profiles SET role = 'super_admin' WHERE email = 'your@email.com';
   ```
4. Visit `/admin/login` and sign in

## Development

```bash
npm install
npm run dev
```

Set these in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Brand

**Instagram:** [@gowtham.edits1](https://www.instagram.com/gowtham.edits1)
