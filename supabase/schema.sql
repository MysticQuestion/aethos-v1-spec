create table if not exists aethos_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  display_name text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_birth_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  profile_id uuid references aethos_profiles(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_natal_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  profile_id uuid references aethos_profiles(id) on delete cascade,
  calculation_mode text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_transit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  profile_id uuid references aethos_profiles(id) on delete cascade,
  calculation_mode text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_timing_windows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  profile_id uuid references aethos_profiles(id) on delete cascade,
  calculation_mode text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  profile_id uuid references aethos_profiles(id) on delete cascade,
  mood integer check (mood between 1 and 10),
  stress integer check (stress between 1 and 10),
  focus integer check (focus between 1 and 10),
  sleep_quality integer check (sleep_quality between 1 and 10),
  clarity integer check (clarity between 1 and 10),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  profile_id uuid references aethos_profiles(id) on delete cascade,
  report_type text not null,
  report_version text not null default 'aethos-report-v1',
  markdown text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_action_experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  timing_window_id uuid references aethos_timing_windows(id) on delete cascade,
  experiment_type text not null,
  status text not null default 'planned',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aethos_analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table aethos_profiles enable row level security;
alter table aethos_birth_intakes enable row level security;
alter table aethos_natal_charts enable row level security;
alter table aethos_transit_events enable row level security;
alter table aethos_timing_windows enable row level security;
alter table aethos_journal_entries enable row level security;
alter table aethos_reports enable row level security;
alter table aethos_action_experiments enable row level security;
alter table aethos_analytics_events enable row level security;
