-- Run once in the Supabase SQL editor.
create table if not exists public.elabels (
  id                text primary key,
  status            text not null default 'pending' check (status in ('pending','active')),
  edit_token_hash   text not null,
  email             text,
  wine              jsonb not null,
  created_at        timestamptz not null default now(),
  paid_until        timestamptz,
  stripe_session_id text
);

-- Only the server (service role key) touches this table. No public policies on purpose:
-- with RLS on and no policies, the anon key can read/write nothing.
alter table public.elabels enable row level security;

create table if not exists public.waitlist (
  id         bigint generated always as identity primary key,
  email      text not null unique,
  preference text not null check (preference in ('one_time','annual','unsure')),
  lang       text,
  source     text,
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
