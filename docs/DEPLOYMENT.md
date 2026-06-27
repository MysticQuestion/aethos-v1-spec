# Deployment

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Vercel

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: `vercel.json` rewrites all routes to `index.html`

## Environment variables

Optional client-safe variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CHART_ENGINE_URL`

Do not expose service role keys or private model/provider secrets in client bundles.
