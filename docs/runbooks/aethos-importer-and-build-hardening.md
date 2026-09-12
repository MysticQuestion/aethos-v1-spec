# Aethos Importer + Mystic Sage Build Hardening Runbook

## Scope note

This repository is the Aethos V1 specification repository. It does not contain the Mystic Sage web application, the TanStack Router source tree, Supabase Edge Functions, or the live Aethos-to-MysticSage importer implementation. Apply this runbook in the implementation repository that contains those assets, then update the reconciliation ADR with the confirmed repository mapping.

## Required importer behavior

### Dry-run mode

The importer must support a dry-run mode that performs every read, validation, diff, missing-asset scan, and verification query, but wraps any target writes in a transaction that is rolled back or avoids opening a write transaction entirely.

Dry-run output must include:

- SQL statements or parameterized SQL previews that would be executed.
- Source row counts by table for the selected shared user IDs.
- Target row counts by table for the same shared user IDs.
- Source checksums by table for the same shared user IDs.
- Target checksums by table for the same shared user IDs.
- Missing code assets, including Edge Functions and expected environment variables.
- A final `would_apply_changes: true|false` flag.

Suggested CLI contract, implemented in this repo as a portable safety wrapper for the implementation repo:

```bash
node scripts/aethos-importer.mjs --user-ids users.txt --dry-run --report-json import-report.json
```

Dry-run must never mutate Mystic Sage target tables. In PostgreSQL/Supabase, prefer one of these approaches:

1. Generate SQL without executing write statements.
2. Execute inside `BEGIN READ ONLY` where possible.
3. Execute inside a normal transaction only in an isolated staging database, then `ROLLBACK` unconditionally.

### Verification report shape

The importer should emit a report that the admin UI can render directly:

```json
{
  "mode": "dry-run",
  "started_at": "2026-05-11T00:00:00.000Z",
  "finished_at": "2026-05-11T00:00:03.000Z",
  "shared_user_ids": ["uuid"],
  "tables": [
    {
      "table": "birth_profiles",
      "source_count": 1,
      "target_count": 1,
      "source_checksum": "sha256:...",
      "target_checksum": "sha256:...",
      "matches": true
    }
  ],
  "missing_assets": [
    {
      "type": "edge_function",
      "name": "generate-profile",
      "status": "missing"
    },
    {
      "type": "env_var",
      "name": "AETHOS_PROFILE_SECRET",
      "status": "missing"
    }
  ],
  "sql_preview": ["insert into ..."],
  "would_apply_changes": false
}
```

### Row-count and checksum comparisons

For every migrated table, compare source and target rows scoped to the shared user IDs. Checksums should be stable across row order, so sort rows by primary key and hash normalized JSON.

Minimum shared table set:

- `users`
- `birth_profiles`
- `chart_facts_cache`
- `timing_events`
- `journal_entries`
- `correlation_summaries`
- `analytics_events`

If the implementation uses different names, maintain a table-mapping config and include it in the report.

## Admin UI requirements

Add an admin-only page or section with:

- `Run Aethos import dry-run` button.
- `Run Aethos import` button gated behind an explicit confirmation step.
- Report panel that displays row counts, checksums, SQL preview, missing code assets, missing environment variables, start time, finish time, and status.
- Download link for the JSON report.
- Error state that preserves the report payload and trace ID.

The admin route must require privileged authorization and must not be visible to normal users.

## Edge Functions and environment-variable audit

The importer release must verify that these Edge Functions are present where required:

- `generate-profile`
- `generate-workshop`

For each function, audit required environment variables in staging and production. The final import report must mark each variable as present or missing without printing secret values.

Example report item:

```json
{"type":"env_var","function":"generate-profile","name":"SUPABASE_SERVICE_ROLE_KEY","status":"present"}
```

## TanStack Router build hardening

### Prebuild cleanup

The web app must delete generated TanStack Router files before route generation/build so stale route trees cannot survive CI or deploys.

Recommended package scripts:

```json
{
  "scripts": {
    "prebuild": "node scripts/clean-tanstack-router-generated.mjs",
    "build": "vite build",
    "postbuild": "node scripts/check-route-tree-single-generation.mjs"
  }
}
```

The cleanup helper in `scripts/clean-tanstack-router-generated.mjs` removes at least:

- `src/routeTree.gen.ts`
- `src/routeTree.gen.tsx`
- `src/routes/routeTree.gen.ts`
- `src/routes/routeTree.gen.tsx`

Adjust paths if the project uses a custom `generatedRouteTree` location.

### Route generation logging

Build logs must include the exact regenerated route tree path and timestamp. Log in ISO-8601 UTC, for example:

```text
[route-tree] regenerated path=/workspace/app/src/routeTree.gen.ts timestamp=2026-05-11T00:00:00.000Z
```

### Duplicate generation guard

The duplicate guard in `scripts/check-route-tree-single-generation.mjs` must run after route generation and fail if more than one generated route tree exists. This prevents duplicate symbols from multiple generated files.

Required failure message:

```text
Duplicate TanStack Router routeTree generated files detected
```

### CI workflow

Configure CI to run on every push and pull request:

1. Install dependencies with the lockfile-aware package manager command.
2. Run the production build.
3. Run the duplicate route-tree guard.
4. Upload or print the route-tree logging output if build fails.

## Acceptance checklist

- [ ] `--dry-run` importer prints SQL changes and missing assets without target database mutation.
- [ ] Import report includes row-count and checksum comparisons for shared user IDs.
- [ ] Admin page can trigger dry-run/import and render the verification report.
- [ ] `generate-profile` and `generate-workshop` Edge Functions are present.
- [ ] Required environment variables are present in staging and production and are reported without secret values.
- [ ] `prebuild` removes generated TanStack Router files.
- [ ] Build logs exact regenerated `routeTree` path and timestamp.
- [ ] Build fails if `routeTree.gen.ts` is generated more than once.
- [ ] CI runs production build on every push and pull request.
- [ ] Production build completes without duplicate routeTree symbols.
