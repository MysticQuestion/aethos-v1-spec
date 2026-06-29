# Backend Architecture

Aethos separates calculation from interpretation. The browser can run deterministic demo mode, but production chart and transit calculations should be routed through a server-side ephemeris service.

## API contracts

- `POST /api/aethos/chart`
- `POST /api/aethos/transits`
- `POST /api/aethos/timing-windows`
- `GET /api/aethos/provider-status`

This Vite/static implementation documents and types the contracts without requiring a server runtime. Future Next.js, edge-function, or FastAPI deployments can implement the same shapes.

## Reproducibility

Calculation metadata includes provider id/version, mode, generated timestamp, input hash, timezone, coordinates, house system, zodiac mode, ephemeris source, and warnings.

## Privacy boundary

Birth data, journal data, timing windows, and reports are sensitive. Local mode stores in browser storage. Supabase mode requires auth and Row Level Security before production use.
