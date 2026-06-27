create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  display_name text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists birth_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  profile_id uuid references profiles(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  profile_id uuid references profiles(id) on delete cascade,
  mood integer check (mood between 1 and 10),
  theme text not null,
  body text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists timing_windows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  profile_id uuid references profiles(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  profile_id uuid references profiles(id) on delete cascade,
  report_type text not null,
  markdown text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table birth_intakes enable row level security;
alter table journal_entries enable row level security;
alter table timing_windows enable row level security;
alter table reports enable row level security;
alter table analytics_events enable row level security;
