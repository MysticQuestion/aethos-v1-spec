# Aethos v1 Specification

Aethos is the identity-intelligence and timing-intelligence platform housed under Mystic Sage. This repository is the canonical specification source for the Aethos app, its schemas, implementation boundaries, and public product language.

## Product category

**Aethos is an identity intelligence platform for symbolic systems, timing analysis, reflective self-tracking, and practitioner-ready reports.**

It begins with astrology because astrology already contains a mature grammar of identity, timing, relational patterning, and developmental pressure. The long-term architecture supports Western astrology, Vedic/Jyotisha, BaZi, Human Design, numerology, I Ching decision logic, journaling, psychometric overlays, and longitudinal calibration.

Aethos should never be framed as deterministic prediction, medical advice, therapy, hiring authority, or legal authority. It is a structured reflective intelligence system with visible uncertainty.

## Repositories

| Repository | Role |
| --- | --- |
| `MysticQuestion/aethos-v1-spec` | Canonical schemas, product architecture, methodology, integration contracts, and roadmap. |
| `MysticQuestion/aethos-your-inner-compass` | Deployable React/Vite Aethos app with onboarding, dashboard, timing lab, learn engine, academy, reports, methodology, and Supabase integration. |
| `MysticQuestion/mystic-sage-journeys` | Public Mystic Sage site at `mysticsage.xyz`; hosts the Aethos public landing, workshop inventory, and links into the Aethos app. |

## v1 platform modules

1. **Canonical Intake** — birth date, birth time, birthplace, current location, name fields, intent, consent, and system preferences.
2. **Calculation Layer** — deterministic ephemeris-backed astrology outputs, Vedic settings, numerology, and future BaZi/Human Design modules.
3. **Interpretation Layer** — structured insight objects and report modules generated from calculation outputs.
4. **Timing Intelligence** — transit windows, stations, personal cycles, domain scoring, confidence labels, and reflection prompts.
5. **Journal + Calibration** — user check-ins for mood, energy, stress, focus, sleep, relationship pressure, and decision confidence.
6. **Academy + Workshops** — educational tracks for symbolic literacy, cross-system synthesis, timing, practitioner ethics, and methodology.
7. **Practitioner Layer** — client vaults, exportable PDFs, client-ready intake, report generation, and session prep.
8. **Governance + Privacy** — consent, data minimization, export, deletion, methodology versioning, and non-deterministic disclaimers.

## Canonical schemas

The current canonical schemas are in `schemas/canonical/`:

- `aethos.birth_intake.v1.json`
- `aethos.calc_config.v1.json`
- `aethos.timing_event.v1.json`
- `aethos.insight_object.v1.json`
- `aethos.report_module.v1.json`
- `mystic_sage.resource.v1.json`

These schemas should be treated as contracts between the app UI, backend calculation services, report generation, and future practitioner/enterprise APIs.


## Launch-readiness documentation

This repository now includes implementation guidance for the Mystic Sage public platform and the deployable Aethos app:

- `docs/IMPLEMENTATION_AUDIT.md` — audited state of this checkout and limitations.
- `docs/MYSTIC_SAGE_PLATFORM_ROADMAP.md` — public platform and Aethos workspace roadmap.
- `docs/AETHOS_ENGINE_ROADMAP.md` — deterministic calculation, timing, report, and API roadmap.
- `docs/CONTENT_QUALITY_STANDARD.md` — copy, resource, workshop, tool, and status standards.
- `docs/DESIGN_SYSTEM.md` — noir/minimal/smoke visual identity and component guidance.
- `docs/RESOURCE_LINK_AUDIT.md` — route/link/resource/workshop deduplication procedure.
- `docs/DEPLOYMENT_CHECKLIST.md` — Vite/TanStack/Vercel deployment and env-var checklist.
- `schemas/canonical/mystic_sage.resource.v1.json` — canonical resource metadata schema.
- `docs/SITE_DEPLOYMENT_RUNBOOK.md` — explicit explanation of why spec-repo changes do not auto-update live sites, plus deployment steps.
- `docs/FRONTEND_EXECUTION_HANDOFF.md` — concrete step-by-step execution plan to implement these specs in deployable frontend repos.


## Portable Aethos MVP implementation

This repository now includes a portable Vite/TypeScript implementation of the Aethos identity-intelligence and timing-intelligence MVP. It was added here because the primary frontend repository could not be cloned from the execution environment. The implementation can be copied into `MysticQuestion/aethos-your-inner-compass` for production deployment.

### Routes

- `/` — public Aethos landing page.
- `/onboarding` — local birth-intake and preference flow.
- `/dashboard` — profile, timing, journal, report, and reflection overview.
- `/profile` — structured symbolic profile.
- `/journal` — local journal composer and entry history.
- `/reports` — deterministic Markdown report generation.
- `/methodology` — responsible-use and interpretive limits.
- `/settings` — storage mode and local data reset.

### Local development

```bash
npm install
npm run dev
```

### Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

### Data modes

- Local mode works without environment variables and stores data in this browser only.
- Supabase mode is enabled only when client-safe public variables are configured.

See `docs/AETHOS_IMPLEMENTATION_NOTES.md`, `docs/DEPLOYMENT.md`, `docs/RESPONSIBLE_USE.md`, and `docs/DATABASE_SCHEMA.md`.


## Aethos Intelligence Core

The portable MVP now includes an intelligence-core scaffold:

- Astro-Integration Kernel modules for zodiac math, aspects, retrogrades/stations, demo ephemeris, natal chart scaffolding, transit events, and timing windows.
- Timing intelligence modules for theme scoring, intensity, confidence, recommendations, and pattern maps.
- EMA-style journal calibration modules for baseline comparison and learning-mode insights.
- Narrative scratchpad/orchestrator modules with deterministic planning and writing agents.
- `/timing-lab` route for active windows, event source table, calibration, action experiments, and raw lab-mode transparency.

The current calculation mode is deterministic demo mode. Swiss Ephemeris-grade calculation is intentionally deferred to a future server-side provider; no LLM is used to calculate chart facts.

See `docs/AETHOS_INTELLIGENCE_CORE.md`, `docs/EPHEMERIS_PROVIDER.md`, `docs/TIMING_INTELLIGENCE.md`, `docs/JOURNAL_CALIBRATION.md`, and `docs/NARRATIVE_SERVICE.md`.


## Backend, ephemeris, storage, and privacy layer

The portable MVP now includes backend/data-layer contracts:

- Typed API contracts for `POST /api/aethos/chart`, `POST /api/aethos/transits`, `POST /api/aethos/timing-windows`, and `GET /api/aethos/provider-status`.
- Calculation metadata utilities for reproducible input hashes, provider ids/versions, modes, warnings, coordinates, timezone, house system, and zodiac mode.
- Provider architecture for deterministic demo mode and future server-side ephemeris mode.
- Local storage router for profiles, birth intakes, natal charts, transit events, timing windows, journal entries, reports, export, import, and deletion.
- Settings/privacy controls for export and local deletion workflows.

See `docs/BACKEND_ARCHITECTURE.md`, `docs/SWISS_EPHEMERIS_SERVICE.md`, and `docs/PRIVACY_AND_DATA_RIGHTS.md`.

## App deployment target

The current app implementation is Vite + React + TypeScript + Tailwind + shadcn/ui with Supabase integration. Recommended deployment target:

- **Vercel project:** `aethos-your-inner-compass`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **SPA fallback:** configured in app repo through `vercel.json`
- **Required environment variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

## Mystic Sage placement

Mystic Sage should present Aethos in three ways:

1. Public Aethos landing/brief page on `mysticsage.xyz`.
2. Separated Aethos Academy workshop lane inside the Mystic Sage workshops section.
3. A prominent launch path into the deployed Aethos app.

## Methodological guardrails

- Separate calculation from interpretation.
- Store confidence labels and data-quality notes.
- Keep outputs reflective, probabilistic, and self-inquiry oriented.
- Avoid medical, therapeutic, employment, financial, or legal claims.
- Make user data exportable and deletable.
- Version schemas, prompts, and methodology.

## Near-term completion checklist

- [x] Canonical spec repository established.
- [x] Core schemas added.
- [x] Aethos app repository identified as the deployable implementation.
- [x] Mystic Sage site updated to host Aethos and separated Aethos workshops.
- [ ] Vercel project connected to `MysticQuestion/aethos-your-inner-compass`.
- [ ] Supabase env vars added to Vercel.
- [ ] Production URL added to Mystic Sage.
- [ ] Auth, onboarding, report generation, and Supabase edge functions tested in production.
