# Security Remediation Runbook — Mystic Sage / Aethos

## Purpose

This runbook addresses the current production security findings:

1. `profiles` rows containing birth data and personal details are publicly readable.
2. The `generate-workshop` Edge Function has no authentication gate.
3. `POST /api/public/hooks/backfill-posts` has no authentication gate.
4. `POST /api/public/hooks/sync-blog` has no authentication gate.
5. A permissive `Profiles are viewable by everyone` RLS policy exposes all user profile data.
6. One or more Postgres extensions are installed in the `public` schema.

These are release-blocking findings because Aethos stores sensitive birth data, location, timezone, and reflective profile information.

## Required remediation

### 1) Lock down `public.profiles`

Apply `supabase/migrations/202605170001_lock_down_profiles_rls.sql` in the implementation repository/database. The migration:

- Enables and forces RLS on `public.profiles`.
- Revokes all direct `anon` access.
- Drops existing permissive `profiles` policies.
- Creates authenticated owner-only `select`, `insert`, `update`, and `delete` policies.
- Supports either `user_id` or `id` as the profile owner column.

If public profile cards are still needed, create a separate `public_profiles` view that exposes only non-sensitive fields such as `display_name`, `avatar_url`, and `bio`. Do not expose birth date, birth time, birth location, latitude, longitude, timezone, or chart data in a public view.

### 2) Require auth on `generate-workshop`

The `generate-workshop` Edge Function must reject anonymous requests before any AI/API call is made. Use the pattern in `docs/examples/security/supabase-edge-auth.ts`:

- Require `Authorization: Bearer <jwt>`.
- Validate the JWT with `supabase.auth.getUser()`.
- Run generation for the authenticated user only.
- Return `401` for missing/invalid tokens.
- Never expose `LOVABLE_API_KEY`, `OPENAI_API_KEY`, service-role keys, prompts, or provider errors in responses.

Apply the same guard to `generate-profile` if it consumes AI credits or writes user-specific profile output.

### 3) Require auth on service-role hook endpoints

The following endpoints must reject unauthenticated requests before using the service-role key:

- `POST /api/public/hooks/backfill-posts`
- `POST /api/public/hooks/sync-blog`

Minimum acceptable gate:

- Require an environment variable such as `SERVER_HOOK_SECRET`.
- Require callers to send `x-hook-secret`.
- Compare using constant-time equality.
- Return `401` when missing or invalid.

Use `docs/examples/security/server-hook-auth.ts` as the implementation template. If the external caller can sign request bodies, prefer `x-hook-signature` HMAC over a raw shared secret header.

### 4) Reduce extension-in-public warning

Run this inventory query in Supabase SQL editor:

```sql
select e.extname, n.nspname as schema
from pg_extension e
join pg_namespace n on n.oid = e.extnamespace
where n.nspname = 'public'
order by e.extname;
```

For extensions that are safe to move, create a dedicated schema and move them:

```sql
create schema if not exists extensions;
grant usage on schema extensions to postgres, anon, authenticated, service_role;
-- Example only; verify each extension first:
-- alter extension "uuid-ossp" set schema extensions;
-- alter extension pgcrypto set schema extensions;
```

Do not blindly move Supabase-managed extensions without checking Supabase compatibility.

## Verification checklist

### Database checks

Run after applying the RLS migration:

```sql
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by policyname;
```

Expected result: owner-only policies only; no `anon` or `public` read-all policy.

Run as an unauthenticated/anon client:

```sql
select * from public.profiles limit 1;
```

Expected result: zero rows or permission denied, never another user's profile.

### Endpoint checks

Expected failures:

```bash
curl -i -X POST "$SITE_URL/api/public/hooks/backfill-posts"
curl -i -X POST "$SITE_URL/api/public/hooks/sync-blog"
curl -i -X POST "$SUPABASE_FUNCTIONS_URL/generate-workshop"
```

Each should return `401` or `403` without doing service-role or AI work.

Expected authorized hook call:

```bash
curl -i -X POST "$SITE_URL/api/public/hooks/sync-blog" \
  -H "x-hook-secret: $SERVER_HOOK_SECRET"
```

Expected authorized Edge Function call:

```bash
curl -i -X POST "$SUPABASE_FUNCTIONS_URL/generate-workshop" \
  -H "authorization: Bearer $USER_JWT" \
  -H "content-type: application/json" \
  --data '{"topic":"example"}'
```

## Release gate

Do not redeploy or promote Aethos until:

- The Supabase linter no longer reports publicly readable `profiles` data.
- Anonymous calls to AI Edge Functions fail before provider calls.
- Anonymous calls to service-role hook endpoints fail before database writes.
- Secret-bearing responses and logs have been reviewed.
