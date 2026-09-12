# Database Schema

The MVP runs in local mode without Supabase. For Supabase mode, create tables equivalent to:

- `aethos_profiles`
- `aethos_birth_intakes`
- `aethos_natal_charts`
- `aethos_timing_windows`
- `aethos_transit_events`
- `aethos_journal_entries`
- `aethos_reports`
- `aethos_action_experiments`
- `aethos_analytics_events` (optional)

Recommended common columns:

- `id uuid primary key`
- `user_id uuid not null`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`
- `calculation_mode text` where calculation output is stored
- `prompt_version` or `report_version` where narrative/report output is stored
- `payload jsonb` for structured calculation and interpretation records

Enable Row Level Security on all user-data tables. Policies should restrict reads/writes to the authenticated owner. Never use service role keys in browser code.
