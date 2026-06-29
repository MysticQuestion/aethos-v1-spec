# Frontend Execution Handoff (Do This Next)

This checklist is the direct follow-through to make visible site updates in production.

## Target repositories

1. `MysticQuestion/mystic-sage-journeys` (public site at `mysticsage.xyz`)
2. `MysticQuestion/aethos-your-inner-compass` (Aethos app)

## Step 1 — Pull latest and create execution branches

```bash
git checkout main
git pull

git checkout -b feat/launch-stability-and-design-refresh
```

## Step 2 — Implement roadmap + standards from this spec repo

Use these source docs from `aethos-v1-spec`:

- `docs/MYSTIC_SAGE_PLATFORM_ROADMAP.md`
- `docs/AETHOS_ENGINE_ROADMAP.md`
- `docs/CONTENT_QUALITY_STANDARD.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/RESOURCE_LINK_AUDIT.md`
- `docs/DEPLOYMENT_CHECKLIST.md`

Apply them to concrete frontend code:

- route fixes
- tool status truthfulness
- fallback states for missing env/backends
- resource/workshop deduplication
- design token update
- typography/layout cleanup

## Step 3 — Required environment variables

For Vite client apps, ensure these are set in Vercel project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_CHART_ENGINE_URL`

If tarot/report interpretation uses Supabase Edge Functions, verify function names and fallback UI copy are wired.

## Step 4 — Build and local verification

```bash
npm install
npm run build
npm run lint
npm run typecheck
npm run dev
```

If `lint` or `typecheck` scripts are missing, add them or explicitly document why they are absent in PR notes.

## Step 5 — Route matrix verification

Verify these resolve without blank page or runtime errors:

- `/`
- `/about`
- `/aethos`
- `/aethos/app`
- `/aethos/app/generator`
- `/aethos/app/profile`
- `/aethos/app/engine`
- `/aethos/app/timing`
- `/aethos/app/divination-lab`
- `/aethos/app/decision-lens`
- `/aethos/app/learn`
- `/aethos/app/academy`
- `/aethos/app/glossary`
- `/aethos/app/journal`
- `/aethos/app/reports`
- `/aethos/app/methodology`
- `/aethos/app/onboarding`
- `/tools`
- `/tools/astrology`
- `/tools/vedic`
- `/tools/human-design`
- `/tools/bazi`
- `/tools/numerology`
- `/tools/mayan`
- `/tools/tarot`
- `/library`
- `/resources`
- `/workshops`
- `/readings`
- `/blog`
- `/articles`
- `/contact`
- `/auth`
- `/admin`

## Step 6 — Deployment checks (Vercel)

- Build command: `npm run build`
- Output dir: `dist` (Vite)
- SPA fallback rewrite present for deep links
- Correct project root selected
- Environment variables configured per environment

## Step 7 — Release acceptance gate

Before merge/deploy, confirm:

1. All main routes load.
2. Deep links work.
3. Tools either work or are honestly marked.
4. No duplicate/broken resource/workshop links.
5. Mobile layouts are clean.
6. No critical console errors.
7. Public pages remain useful without login.
8. Aethos app handles missing auth/data gracefully.
