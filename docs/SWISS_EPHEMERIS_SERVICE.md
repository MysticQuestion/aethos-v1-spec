# Swiss Ephemeris Service

Swiss Ephemeris or pyswisseph should run server-side only. Do not bundle licensed ephemeris code or files into browser code.

## Recommended service

- FastAPI or equivalent private service.
- Endpoint: `POST /chart`, `POST /transits`, `GET /provider-status`.
- Inputs: UTC/local birth data, timezone, coordinates, house system, zodiac mode, orb settings.
- Outputs: chart facts, transit events, retrograde/station events, calculation metadata, warnings.

## Licensing caution

Commercial SaaS use may require a professional Swiss Ephemeris license. Confirm licensing before production deployment.

## Secrets

Keep ephemeris file paths, service tokens, and infrastructure secrets server-side only.
