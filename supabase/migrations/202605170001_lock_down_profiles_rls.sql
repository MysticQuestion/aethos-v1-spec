-- Lock down public.profiles so birth data and personal details are not publicly readable.
--
-- This migration is intentionally defensive because implementation repos have used
-- either `user_id` or `id` as the owner column. It drops existing policies on
-- public.profiles, enables/forces RLS, and recreates owner-only policies.
--
-- Review before applying if public.profiles intentionally exposes any non-sensitive
-- fields. If public profile cards are needed, expose a separate view with only
-- display_name/avatar_url/bio and no birth data.

begin;

alter table if exists public.profiles enable row level security;
alter table if exists public.profiles force row level security;

do $$
declare
  owner_column text;
  policy_record record;
begin
  if to_regclass('public.profiles') is null then
    raise notice 'public.profiles does not exist; skipping profile RLS remediation.';
    return;
  end if;

  revoke all on table public.profiles from anon;
  revoke all on table public.profiles from authenticated;
  grant select, insert, update, delete on table public.profiles to authenticated;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'user_id'
  ) then
    owner_column := 'user_id';
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'id'
  ) then
    owner_column := 'id';
  else
    raise exception 'public.profiles must have user_id or id owner column before RLS policies can be created.';
  end if;

  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', policy_record.policyname);
  end loop;

  execute format(
    'create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = %I)',
    owner_column
  );

  execute format(
    'create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = %I)',
    owner_column
  );

  execute format(
    'create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = %I) with check ((select auth.uid()) = %I)',
    owner_column,
    owner_column
  );

  execute format(
    'create policy "profiles_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = %I)',
    owner_column
  );
end $$;

commit;
