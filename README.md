# Aethos V1 Spec

This repository is the source-of-truth specification for the Aethos system: a deterministic symbolic analytics engine for timing intelligence, structured self-knowledge, and journaling-based pattern awareness.

## Repository role

Use this repo to answer: **what is Aethos, what must ship in V1, and what must not be claimed?**

It contains:

- Product strategy and launch scope in [`docs/01_NORTH_STAR_BRIEF.md`](docs/01_NORTH_STAR_BRIEF.md) and [`docs/02_PRD.md`](docs/02_PRD.md).
- User journeys, data model, API, architecture, analytics, QA, compliance, roadmap, and hiring artifacts under [`docs/`](docs/).
- Early Python calculation-layer scaffolding under [`src/aethos/`](src/aethos/).
- Implementation runbooks and helper scripts for the website/app repositories under [`docs/runbooks/`](docs/runbooks/) and [`scripts/`](scripts/).
- Security remediation artifacts for profile RLS, authenticated Edge Functions, and protected server hooks under [`supabase/migrations/`](supabase/migrations/) and [`docs/runbooks/security-remediation.md`](docs/runbooks/security-remediation.md).
- Competitive/product research memos such as [`docs/13_VEDIC_CALCULATOR_LANDSCAPE.md`](docs/13_VEDIC_CALCULATOR_LANDSCAPE.md) and [`docs/14_BAZI_CALCULATOR_LANDSCAPE.md`](docs/14_BAZI_CALCULATOR_LANDSCAPE.md).

This repo should **not** be treated as the live website repository. It should feed requirements, launch copy constraints, and API/calculation contracts into the implementation repositories.

## Related repository responsibilities

| Repository | Intended responsibility | Launch relationship |
| --- | --- | --- |
| `aethos-v1-spec` | Product, technical, compliance, QA, and launch source of truth. | Governs what is allowed to go live. |
| `mystic-sage-journeys` | Public `mysticsage.xyz` website and brand/marketing surface, if that repo contains the deployed site. | Should consume approved Aethos positioning, non-claims copy, and CTA flow from this spec. |
| `aethos-your-inner-compass` | Aethos app/product implementation, if that repo contains the runnable user experience. | Should implement the V1 API, calculation, journaling, and compliance requirements from this spec. |

If the deployment settings show a different mapping, update this table and the reconciliation checklist before shipping.

## Launch reconciliation checklist

Before Aethos is made live on or through `mysticsage.xyz`:

1. Confirm the deployed website repository and hosting target.
2. Confirm whether Aethos is a standalone app, a subdomain, or a section of the Mystic Sage website.
3. Update the public website copy to match the approved positioning and non-claims language.
4. Verify the app implementation matches the V1 API, data model, and QA plan.
5. Run the compliance checklist and remove deterministic or predictive phrasing.
6. Smoke-test the complete user path: landing page → onboarding/application → birth profile → today view → journal entry.

See [`docs/00_REPOSITORY_RECONCILIATION.md`](docs/00_REPOSITORY_RECONCILIATION.md) for the working reconciliation plan.

## Current status

Aethos is still in **specification + scaffold** state in this repository. The Python modules are not production-hardened and require ephemeris, timezone, validation, fixture, and packaging work before deployment.
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
