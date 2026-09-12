#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const TABLES = [
  { name: 'users', pk: 'user_id', filter: (ids) => `user_id in (${ids})` },
  { name: 'birth_profiles', pk: 'profile_id', filter: (ids) => `user_id in (${ids})` },
  {
    name: 'chart_facts_cache',
    pk: 'facts_id',
    filter: (ids) => `profile_id in (select profile_id from birth_profiles where user_id in (${ids}))`,
  },
  {
    name: 'timing_events',
    pk: 'event_id',
    filter: (ids) => `profile_id in (select profile_id from birth_profiles where user_id in (${ids}))`,
  },
  { name: 'journal_entries', pk: 'entry_id', filter: (ids) => `user_id in (${ids})` },
  { name: 'correlation_summaries', pk: 'summary_id', filter: (ids) => `user_id in (${ids})` },
  { name: 'analytics_events', pk: 'event_id', filter: (ids) => `user_id in (${ids})` },
];

const EDGE_FUNCTIONS = ['generate-profile', 'generate-workshop'];
const REQUIRED_ENV = {
  'generate-profile': ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY'],
  'generate-workshop': ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY'],
};

function parseArgs(argv) {
  const args = { dryRun: false, apply: false, repoRoot: process.cwd(), sourceSchema: 'aethos', targetSchema: 'mysticsage' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--apply') args.apply = true;
    else if (arg === '--user-ids') args.userIds = argv[++i];
    else if (arg === '--source-database-url') args.sourceDatabaseUrl = argv[++i];
    else if (arg === '--target-database-url') args.targetDatabaseUrl = argv[++i];
    else if (arg === '--source-schema') args.sourceSchema = argv[++i];
    else if (arg === '--target-schema') args.targetSchema = argv[++i];
    else if (arg === '--report-json') args.reportJson = argv[++i];
    else if (arg === '--repo-root') args.repoRoot = argv[++i];
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  return `Usage: node scripts/aethos-importer.mjs --dry-run --user-ids <comma-list-or-file> [options]\n\nOptions:\n  --source-database-url <url>   Aethos source Postgres/Supabase URL\n  --target-database-url <url>   Mystic Sage target Postgres/Supabase URL\n  --source-schema <name>        Source schema name (default: aethos)\n  --target-schema <name>        Target schema name (default: mysticsage)\n  --report-json <path>          Write verification report JSON\n  --repo-root <path>            Repository root used for Edge Function asset checks\n  --apply                       Reserved for the real write path; not allowed with --dry-run\n`;
}

async function readUserIds(input) {
  if (!input) return [];
  if (existsSync(input)) {
    const text = await readFile(input, 'utf8');
    return text.split(/[\n,]/).map((value) => value.trim()).filter(Boolean);
  }
  return input.split(',').map((value) => value.trim()).filter(Boolean);
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function idsSql(userIds) {
  return userIds.map(sqlString).join(', ');
}

function sqlIdentifier(value) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new Error(`Invalid SQL identifier: ${value}`);
  return `"${value}"`;
}

function buildChecksumSql(table, quotedIds, schemaName, includeChecksum) {
  const where = table.filter(quotedIds);
  const qualifiedTable = `${sqlIdentifier(schemaName)}.${sqlIdentifier(table.name)}`;
  if (!includeChecksum) {
    return `select json_build_object('row_count', count(*), 'checksum', null, 'checksum_status', 'skipped_pgcrypto_unavailable') from ${qualifiedTable} t where ${where};`;
  }
  return `select json_build_object('row_count', count(*), 'checksum', coalesce('sha256:' || encode(digest(coalesce(string_agg(to_jsonb(t)::text, '' order by ${table.pk}::text), ''), 'sha256'), 'hex'), 'sha256:'), 'checksum_status', 'ok') from ${qualifiedTable} t where ${where};`;
}

function buildSqlPreview(userIds, sourceSchema, targetSchema) {
  const quotedIds = idsSql(userIds);
  return TABLES.map((table) => {
    const where = table.filter(quotedIds);
    const qualifiedSource = `${sqlIdentifier(sourceSchema)}.${sqlIdentifier(table.name)}`;
    const qualifiedTarget = `${sqlIdentifier(targetSchema)}.${sqlIdentifier(table.name)}`;
    return `-- ${table.name}\ninsert into ${qualifiedTarget}\nselect * from ${qualifiedSource}\nwhere ${where}\non conflict do nothing;`;
  });
}

function runPsql(databaseUrl, sql) {
  if (!databaseUrl) return { status: 'skipped', reason: 'database URL not provided' };
  const result = spawnSync('psql', [databaseUrl, '--no-psqlrc', '--tuples-only', '--no-align', '--command', sql], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) {
    return { status: 'skipped', reason: result.error.code === 'ENOENT' ? 'psql is not installed' : result.error.message };
  }
  if (result.status !== 0) {
    return { status: 'error', error: result.stderr.trim() || result.stdout.trim() };
  }
  try {
    return { status: 'ok', ...JSON.parse(result.stdout.trim()) };
  } catch (error) {
    return { status: 'error', error: `Unable to parse psql JSON output: ${error.message}`, raw: result.stdout.trim() };
  }
}

function hasPgcrypto(databaseUrl) {
  const result = runPsql(databaseUrl, "select json_build_object('pgcrypto_available', exists (select 1 from pg_extension where extname = 'pgcrypto'));");
  return result.status === 'ok' ? Boolean(result.pgcrypto_available) : null;
}

function collectAssetChecks(repoRoot) {
  const root = resolve(repoRoot);
  const assetChecks = [];

  for (const fn of EDGE_FUNCTIONS) {
    const candidates = [
      resolve(root, 'supabase/functions', fn, 'index.ts'),
      resolve(root, 'supabase/functions', fn, 'index.tsx'),
      resolve(root, 'supabase/functions', fn, 'index.js'),
      resolve(root, 'supabase/functions', fn, 'index.mjs'),
    ];
    assetChecks.push({
      type: 'edge_function',
      name: fn,
      status: candidates.some((candidate) => existsSync(candidate)) ? 'present' : 'missing',
      expected_paths: candidates,
    });

    for (const envName of REQUIRED_ENV[fn] ?? []) {
      assetChecks.push({
        type: 'env_var',
        function: fn,
        name: envName,
        status: process.env[envName] ? 'present' : 'missing',
      });
    }
  }

  return assetChecks;
}

function compareTables(userIds, sourceDatabaseUrl, targetDatabaseUrl, sourceSchema, targetSchema) {
  const quotedIds = idsSql(userIds);
  const sourcePgcrypto = hasPgcrypto(sourceDatabaseUrl);
  const targetPgcrypto = hasPgcrypto(targetDatabaseUrl);
  return TABLES.map((table) => {
    const source = runPsql(sourceDatabaseUrl, buildChecksumSql(table, quotedIds, sourceSchema, sourcePgcrypto !== false));
    const target = runPsql(targetDatabaseUrl, buildChecksumSql(table, quotedIds, targetSchema, targetPgcrypto !== false));
    return {
      table: table.name,
      source_count: source.row_count ?? null,
      target_count: target.row_count ?? null,
      source_checksum: source.checksum ?? null,
      target_checksum: target.checksum ?? null,
      source_checksum_status: source.checksum_status ?? null,
      target_checksum_status: target.checksum_status ?? null,
      source_status: source.status,
      target_status: target.status,
      source_error: source.error,
      target_error: target.error,
      matches: source.status === 'ok' && target.status === 'ok' && source.row_count === target.row_count && ((source.checksum && target.checksum && source.checksum === target.checksum) || (!source.checksum && !target.checksum)),
    };
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  if (args.apply && args.dryRun) throw new Error('Use either --dry-run or --apply, not both.');
  if (!args.dryRun) throw new Error('This safety wrapper currently supports --dry-run only. Use the implementation repo write path for --apply.');

  const startedAt = new Date().toISOString();
  const userIds = await readUserIds(args.userIds);
  if (userIds.length === 0) throw new Error('At least one shared user ID is required via --user-ids.');

  const sqlPreview = buildSqlPreview(userIds, args.sourceSchema, args.targetSchema);
  const report = {
    mode: 'dry-run',
    started_at: startedAt,
    finished_at: null,
    shared_user_ids: userIds,
    source_schema: args.sourceSchema,
    target_schema: args.targetSchema,
    tables: compareTables(userIds, args.sourceDatabaseUrl, args.targetDatabaseUrl, args.sourceSchema, args.targetSchema),
    asset_checks: collectAssetChecks(args.repoRoot),
    sql_preview: sqlPreview,
    would_apply_changes: sqlPreview.length > 0,
  };
  report.finished_at = new Date().toISOString();

  console.log(JSON.stringify(report, null, 2));
  if (args.reportJson) {
    const path = resolve(args.reportJson);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    console.error(`[aethos-importer] wrote dry-run report path=${path}`);
  }
}

main().catch((error) => {
  console.error(`[aethos-importer] ${error.message}`);
  console.error(usage());
  process.exit(1);
});
