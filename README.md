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

These schemas should be treated as contracts between the app UI, backend calculation services, report generation, and future practitioner/enterprise APIs.

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
