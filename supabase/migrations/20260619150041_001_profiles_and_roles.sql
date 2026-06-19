/*
# Profiles, Roles, and Auth Helper Functions

## Summary
Creates the core authentication infrastructure for the GOWTHAM EDITS admin system.
This migration establishes user profiles (linked to Supabase auth.users), a role
enum (super_admin / admin / editor), helper functions used by RLS policies, and a
trigger that auto-creates a profile row whenever a new auth user is created.

## New Tables
- `profiles` — one row per auth user; stores display name, avatar, role, active status.
  - `id` — uuid, primary key, references auth.users(id) with cascade delete
  - `email` — text, not null
  - `full_name` — text, nullable
  - `avatar_url` — text, nullable
  - `role` — enum: super_admin | admin | editor (default: editor)
  - `is_active` — boolean, default true; set to false to suspend a user
  - `created_at` / `updated_at` — timestamps

## New Types
- `user_role` enum: 'super_admin', 'admin', 'editor'

## New Functions
- `public.is_super_admin()` — returns true if the caller's profile has role=super_admin and is active
- `public.is_admin()` — returns true if role IN (admin, super_admin) and active
- `public.is_staff()` — returns true if ANY role and active (any valid, active admin user)
- `public.handle_new_user()` — trigger function; inserts a profile row on auth.users INSERT

## New Triggers
- `on_auth_user_created` on auth.users — calls handle_new_user() after each new signup

## Security
- RLS enabled on profiles.
- Staff can read all profiles; users can always read and update their own.
- Only super_admin can update other profiles' role or is_active.
- Only super_admin can delete profiles.

## Important Notes
1. Email confirmation is intentionally DISABLED — users are invited/created by super_admin.
2. The first super_admin must be promoted manually via SQL after account creation.
3. `is_active = false` effectively locks the user out since all RLS helpers check is_active.
*/

-- Create user_role enum if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor');
  END IF;
END;
$$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  avatar_url  text,
  role        user_role NOT NULL DEFAULT 'editor',
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_staff" ON profiles;
CREATE POLICY "profiles_select_staff" ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_active
  ));

DROP POLICY IF EXISTS "profiles_update_self_or_superadmin" ON profiles;
CREATE POLICY "profiles_update_self_or_superadmin" ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin' AND p.is_active
  ))
  WITH CHECK (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin' AND p.is_active
  ));

DROP POLICY IF EXISTS "profiles_delete_superadmin" ON profiles;
CREATE POLICY "profiles_delete_superadmin" ON profiles FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin' AND p.is_active
  ));

-- Helper functions (SECURITY DEFINER to avoid infinite recursion on RLS-protected profiles table)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_active = true
  );
$$;

-- Auto-create profile row when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
