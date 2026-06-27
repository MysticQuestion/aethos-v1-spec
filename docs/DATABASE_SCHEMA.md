# Database Schema

The MVP runs in local mode without Supabase. For Supabase mode, create tables equivalent to:

- `profiles`
- `birth_intakes`
- `journal_entries`
- `reports`
- `timing_windows`
- `analytics_events` (optional)

Enable Row Level Security on all user-data tables. Policies should restrict reads/writes to the authenticated owner. Never use service role keys in browser code.
