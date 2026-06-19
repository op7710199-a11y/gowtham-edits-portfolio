create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz default now()
);
```