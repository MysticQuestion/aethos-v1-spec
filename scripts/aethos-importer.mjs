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
  const args = { dryRun: false, apply: false, repoRoot: process.cwd() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--apply') args.apply = true;
    else if (arg === '--user-ids') args.userIds = argv[++i];
    else if (arg === '--source-database-url') args.sourceDatabaseUrl = argv[++i];
    else if (arg === '--target-database-url') args.targetDatabaseUrl = argv[++i];
    else if (arg === '--report-json') args.reportJson = argv[++i];
    else if (arg === '--repo-root') args.repoRoot = argv[++i];
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function usage() {
  return `Usage: node scripts/aethos-importer.mjs --dry-run --user-ids <comma-list-or-file> [options]\n\nOptions:\n  --source-database-url <url>   Aethos source Postgres/Supabase URL\n  --target-database-url <url>   Mystic Sage target Postgres/Supabase URL\n  --report-json <path>          Write verification report JSON\n  --repo-root <path>            Repository root used for Edge Function asset checks\n  --apply                       Reserved for the real write path; not allowed with --dry-run\n`;
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

function buildChecksumSql(table, quotedIds) {
  const where = table.filter(quotedIds);
  return `select json_build_object('row_count', count(*), 'checksum', coalesce('sha256:' || encode(digest(coalesce(string_agg(to_jsonb(t)::text, '' order by ${table.pk}::text), ''), 'sha256'), 'sha256:')) from ${table.name} t where ${where};`;
}

function buildSqlPreview(userIds) {
  const quotedIds = idsSql(userIds);
  return TABLES.map((table) => {
    const where = table.filter(quotedIds);
    return `-- ${table.name}\ninsert into mysticsage.${table.name}\nselect * from aethos.${table.name}\nwhere ${where}\non conflict do nothing;`;
  });
}

function commandExists(command) {
  return spawnSync('bash', ['-lc', `command -v ${command}`], { encoding: 'utf8' }).status === 0;
}

function runPsql(databaseUrl, sql) {
  if (!databaseUrl) return { status: 'skipped', reason: 'database URL not provided' };
  if (!commandExists('psql')) return { status: 'skipped', reason: 'psql is not installed' };
  const result = spawnSync('psql', [databaseUrl, '--no-psqlrc', '--tuples-only', '--no-align', '--command', sql], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.status !== 0) {
    return { status: 'error', error: result.stderr.trim() || result.stdout.trim() };
  }
  try {
    return { status: 'ok', ...JSON.parse(result.stdout.trim()) };
  } catch (error) {
    return { status: 'error', error: `Unable to parse psql JSON output: ${error.message}`, raw: result.stdout.trim() };
  }
}

function checkAssets(repoRoot) {
  const root = resolve(repoRoot);
  const missingAssets = [];

  for (const fn of EDGE_FUNCTIONS) {
    const candidates = [
      resolve(root, 'supabase/functions', fn, 'index.ts'),
      resolve(root, 'supabase/functions', fn, 'index.tsx'),
      resolve(root, 'supabase/functions', fn, 'index.js'),
      resolve(root, 'supabase/functions', fn, 'index.mjs'),
    ];
    if (!candidates.some((candidate) => existsSync(candidate))) {
      missingAssets.push({ type: 'edge_function', name: fn, status: 'missing', expected_paths: candidates });
    }

    for (const envName of REQUIRED_ENV[fn] ?? []) {
      missingAssets.push({
        type: 'env_var',
        function: fn,
        name: envName,
        status: process.env[envName] ? 'present' : 'missing',
      });
    }
  }

  return missingAssets;
}

function compareTables(userIds, sourceDatabaseUrl, targetDatabaseUrl) {
  const quotedIds = idsSql(userIds);
  return TABLES.map((table) => {
    const source = runPsql(sourceDatabaseUrl, buildChecksumSql(table, quotedIds));
    const target = runPsql(targetDatabaseUrl, buildChecksumSql(table, quotedIds));
    return {
      table: table.name,
      source_count: source.row_count ?? null,
      target_count: target.row_count ?? null,
      source_checksum: source.checksum ?? null,
      target_checksum: target.checksum ?? null,
      source_status: source.status,
      target_status: target.status,
      source_error: source.error,
      target_error: target.error,
      matches: source.status === 'ok' && target.status === 'ok' && source.row_count === target.row_count && source.checksum === target.checksum,
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

  const sqlPreview = buildSqlPreview(userIds);
  const report = {
    mode: 'dry-run',
    started_at: startedAt,
    finished_at: null,
    shared_user_ids: userIds,
    tables: compareTables(userIds, args.sourceDatabaseUrl, args.targetDatabaseUrl),
    missing_assets: checkAssets(args.repoRoot),
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
