# Deployment Checklist

## Repository reality check

This spec repository has no web build system. Deployment checks below apply to the deployable repositories documented in `README.md`:

- Mystic Sage public site: `MysticQuestion/mystic-sage-journeys`
- Aethos app: `MysticQuestion/aethos-your-inner-compass`

## Vite / React / TanStack deployment checklist

Use this when the deployable app is Vite, TanStack Router, or a client-rendered React SPA.

### Vercel settings

- Framework preset: Vite, or “Other” with explicit build/output settings.
- Root directory: repository root unless app lives in a subdirectory.
- Build command: `npm run build`.
- Output directory: `dist`.
- Install command: `npm install` or the lockfile-specific command.
- Node version: match local `.nvmrc` or Vercel project setting.

### SPA fallback

Add `vercel.json` when deep links are client-routed:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is required so `/aethos/app/profile`, `/tools/tarot`, and other deep links do not return a Vercel 404.

### Environment variables

Client-exposed Vite variables must use the `VITE_` prefix.

Required or expected:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_CHART_ENGINE_URL`

Optional/future variables to document but not hardcode:

- Geocoding provider key.
- Timezone provider key.
- Email provider key.
- Stripe publishable key.
- Redis/queue endpoint if exposed only server-side where appropriate.
- Push notification public key.

### Supabase Edge Functions

If tarot interpretation or report synthesis uses Supabase Edge Functions, document:

- Function name.
- Client invocation path.
- Required server-side secrets.
- Timeout behavior.
- Fallback copy.

Required fallback copy for tarot interpretation:

> The interpretation service is unavailable. Your card draw is still shown below.

## Preflight checks

Run before deployment:

```bash
npm install
npm run build
npm run lint
npm run typecheck
npm run dev
```

If a script does not exist, record that explicitly in the release notes instead of treating it as passed.

## Manual route smoke test

Verify these routes at minimum:

- `/`
- `/about`
- `/aethos`
- `/aethos/app`
- `/aethos/app/generator`
- `/aethos/app/profile`
- `/aethos/app/timing`
- `/aethos/app/journal`
- `/aethos/app/reports`
- `/tools`
- `/tools/astrology`
- `/tools/vedic`
- `/tools/human-design`
- `/tools/bazi`
- `/tools/numerology`
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

For each route, verify:

- No blank/black page.
- No console errors.
- No broken imports/assets.
- Mobile layout is readable.
- CTAs point to valid destinations.
- Empty data states are graceful.
- Auth-protected pages handle unauthenticated users cleanly.

## Feature fallback checks

- Missing `VITE_CHART_ENGINE_URL` shows payload preview and connection guidance.
- Missing Supabase variables show content fallbacks or disabled auth states.
- Missing Edge Function does not hide tarot draw.
- Empty blog/resource tables do not crash archive pages.
- Save buttons either persist data or clearly say local/demo-only.

## Production acceptance

A release is ready only when:

1. Production build succeeds.
2. Main routes load and deep links resolve.
3. Implemented tools work or show honest fallback states.
4. Resource/workshop links are deduplicated and reviewed.
5. No unfinished feature is presented as finished.
6. Accessibility and mobile checks pass.
7. Required env vars are configured in Vercel.
8. Privacy/terms and non-claims copy are present.
