# Aethos Repository Audit + Unified Lovable Build Prompt

_Last updated: 2026-06-10_

## Executive finding

Aethos is split across four repositories. The split is recoverable, but the roles must be made explicit before further development or deployment work continues.

| Repository | Current condition | Correct role going forward |
| --- | --- | --- |
| `MysticQuestion/aethos-v1-spec` | Canonical source-of-truth spec with PRD, schemas, reconciliation plan, compliance guardrails, and early calculation scaffolding. | Keep as the governing product, schema, architecture, methodology, QA, and compliance repository. Do not deploy this as the live app. |
| `MysticQuestion/aethos-your-inner-compass` | Current deployable web app. `package.json` is Next.js 15 / React 19, while older `src/` Vite/React Router files remain present but excluded from TypeScript. | Make this the primary web application. Finish the Next.js App Router implementation and retire or port legacy `src/` code. |
| `MysticQuestion/the-aethos-app` | Expo / React Native / Express / Drizzle / PostgreSQL prototype with `ephemeris`; README is still the default Expo note. | Preserve as mobile/backend prototype material. Do not connect it to production web deployment until architectural decisions are finalized. |
| `MysticQuestion/aethos` | Empty public repository with a broad product description. | Use only as a future consolidated public monorepo after migration, or convert it into an index repo that points to the canonical spec and deployable app. Do not treat it as live. |

## Highest-risk issues

1. **Framework confusion in the deployable app.** The web app currently identifies as Next.js in `package.json` and `vercel.json`, but its README still describes a Vite app with React Router, shadcn/Radix, Recharts, jsPDF, Vite env vars, and a `dist` output. This can lead to incorrect Vercel project settings and blank deployments.
2. **Dual app directories.** The deployable repo contains a real Next.js `app/` tree and a legacy `src/` Vite/React Router tree. `tsconfig.json` excludes `src`, so the legacy generator and routes are not part of the Next build unless manually ported.
3. **Public copy overclaims functionality.** The landing page mentions seven systems while major production dependencies remain TODO: geocoding, timezone resolution, ephemeris precision, persisted profiles, Supabase-backed auth, journal CRUD, report generation, export/deletion, and practitioner workflows.
4. **Old repos can mislead deployment tooling.** `the-aethos-app` is substantial but not the current web deploy target; `aethos` is empty and should not be connected to Vercel.
5. **Missing production readiness evidence.** Auth, onboarding persistence, protected profile reads, RLS, Edge Function auth, journal creation, report creation, data export/deletion, and public-path smoke tests still need verification.

## Required reconciliation decision

Adopt this decision immediately:

> `aethos-v1-spec` governs the product. `aethos-your-inner-compass` is the live web implementation. `the-aethos-app` is archived as mobile/backend prototype material. `aethos` is reserved for future consolidation or public index documentation.

## Required build posture for Aethos V1

Aethos V1 must ship as a disciplined reflective-intelligence application, not a novelty horoscope page and not a fatalistic prediction engine.

### V1 must include

- Account creation, login, password reset, protected dashboard, and session-aware navigation.
- Canonical intake: name or alias, birth date, birth time, birth time confidence, birthplace, current location, consent, and system preferences.
- Location normalization: geocoding, timezone resolution, latitude, longitude, country/region, and confidence notes.
- Calculation contracts aligned to the canonical schemas in `aethos-v1-spec/schemas/canonical/`.
- Western tropical Whole Sign natal baseline.
- Vedic sidereal Lahiri basic placements and Sun/Moon nakshatra, with ayanamsa metadata stored.
- Numerology core numbers.
- Declared placeholder architecture for BaZi and Human Design until production-grade algorithms are installed.
- Daily timing activations with orb, aspect type, strength score, confidence label, source calculation version, and data-quality notes.
- Journal entries linked to the daily activation set.
- Reports that can be generated, saved, viewed, and exported as PDF.
- Settings page with export data, delete account/profile data, privacy language, and methodology version display.
- Non-claims language in onboarding, dashboard, reports, footer, and settings.
- Public Mystic Sage landing path that routes into Aethos without dead buttons.

### V1 must not claim

- Event prediction.
- Medical, legal, financial, employment, therapeutic, or emergency authority.
- Fully accurate Human Design, BaZi, Vedic dashas, vargas, remedies, astrocartography, or AI astrologer chat before those modules have tested calculation engines.
- Any guarantee that symbolic timing determines outcomes.

## Immediate engineering remediation checklist

### In `aethos-your-inner-compass`

- [ ] Update README so it matches the actual Next.js stack.
- [ ] Decide whether legacy `src/` code is to be deleted or ported into the Next.js `app/` routes.
- [ ] Port the useful browser calculator logic from `src/lib/aethos/calculator.ts` into `lib/aethos/` and expose it through Next routes/components.
- [ ] Create production routes: `/`, `/onboarding`, `/dashboard`, `/engine`, `/timing`, `/journal`, `/reports`, `/profile`, `/methodology`, `/privacy`, `/settings`.
- [ ] Replace TODO geocoding/timezone stubs with a typed service layer and clear fallback state.
- [ ] Add Supabase client/server utilities appropriate for Next.js, not Vite-only env naming.
- [ ] Add `.env.example` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and backend-only service variables if used.
- [ ] Add tests or fixtures for birth conversion, Julian Day, Western placements, Vedic metadata, journal CRUD, and report generation.
- [ ] Ensure Vercel project uses Framework Preset: Next.js, Build Command: `npm run build`, Output Directory: default / unset.

### In `aethos-v1-spec`

- [ ] Treat schemas as contracts and reject implementation objects that do not conform.
- [ ] Add an ADR for repository ownership and launch path.
- [ ] Keep public-product claims synchronized with implementation reality.
- [ ] Maintain non-claims language and banned deterministic phrasing.

### In `the-aethos-app`

- [ ] Replace default Expo README with a clear prototype status note.
- [ ] Mark as mobile/backend prototype material unless it is actively revived.
- [ ] Do not connect to production Vercel web deployment.

### In `aethos`

- [ ] Keep empty until a full monorepo migration is intentional.
- [ ] Add README pointing to spec and web app if used as public index.

---

# Lovable / GitHub / Vercel Build Prompt

Use the following prompt to build the consolidated Aethos app.

```text
You are working on Aethos, Mystic Sage’s identity-intelligence and timing-intelligence application. Audit and reconcile all Aethos repositories before writing code:

1. `MysticQuestion/aethos-v1-spec` is the canonical source of truth for product strategy, schemas, methodology, launch gates, non-claims language, QA, and compliance. Do not deploy this repo as the app.
2. `MysticQuestion/aethos-your-inner-compass` is the deployable web app. It must become the primary production implementation.
3. `MysticQuestion/the-aethos-app` is an Expo / React Native / Express / Drizzle / PostgreSQL prototype. Preserve useful ideas, but do not treat it as the Vercel web deploy target.
4. `MysticQuestion/aethos` is currently empty / reserved. Do not attach it to production unless intentionally migrating to a monorepo.

Primary objective:
Build a fully functional Aethos V1 web app in `MysticQuestion/aethos-your-inner-compass`, aligned to the canonical spec in `MysticQuestion/aethos-v1-spec`, ready for Vercel deployment and Mystic Sage integration.

Technical target:
- Framework: Next.js 15 App Router + React 19 + TypeScript.
- Styling: Tailwind CSS with Mystic Sage/Aethos visual direction: black, aged paper, muted gold, oxblood, restrained cream, serif-led editorial interface. Avoid purple/magenta-heavy styling, cartoon mascots, novelty horoscope aesthetics, and generic SaaS gloss.
- Backend/data: Supabase for auth, profiles, journal entries, reports, saved calculations, and RLS. Use Next-compatible env vars.
- Deployment: Vercel project should use Next.js preset, `npm run build`, no `dist` output directory.
- Code quality: strict TypeScript, accessible components, mobile-first responsive layouts, no dead buttons, no placeholder CTAs without routes.

Repository cleanup:
- Update `README.md` in the app repo so it accurately describes Next.js, not Vite.
- Port any useful legacy calculator code from `src/lib/aethos/calculator.ts` into the Next.js `lib/aethos/` layer.
- Retire or clearly quarantine legacy `src/` Vite/React Router code so it does not confuse maintainers.
- Add `.env.example` documenting all required variables.
- Add a production readiness checklist.
- Ensure every visible link, card, CTA, footer item, and nav button resolves to a real route or action.

Core product concept:
Aethos is not a novelty horoscope app. It is a structured reflective-intelligence system for symbolic identity, timing analysis, journaling, source-aware interpretation, and practitioner-ready reports. It begins with astrology and grows toward cross-system synthesis: Western astrology, Vedic/Jyotisha, BaZi, Human Design, numerology, I Ching decision logic, psychometric overlays, journaling, and practitioner workflows.

V1 scope:
1. Public landing page
   - Explain Aethos as identity intelligence and timing intelligence.
   - Include clear non-claims language: symbolic timing context for reflection, not event prediction or medical/legal/financial advice.
   - CTA: create account, sign in, or enter demo.
   - Include methodology preview and privacy commitments.

2. Auth
   - Email/password auth with Supabase.
   - Protected dashboard and protected profile/report/journal routes.
   - Password reset flow.
   - Auth-aware header.

3. Onboarding / canonical intake
   - Fields: display name or alias, birth date, birth time, birth time confidence, birthplace, current location, consent, preferred systems.
   - Geocode birthplace to lat/lon/timezone where possible.
   - Store canonical UTC, local time, timezone source, latitude, longitude, country/region, confidence notes.
   - Save profile to Supabase with owner-only RLS.

4. Calculation layer
   - Separate calculation outputs from interpretations.
   - Align output shapes to canonical schemas from `aethos-v1-spec/schemas/canonical/`.
   - Western Tropical Whole Sign: Sun, Moon, Ascendant, Midheaven, planetary placements, houses, major aspects.
   - Vedic Sidereal Lahiri: basic placements and Sun/Moon nakshatra; persist zodiac mode, ayanamsa, ephemeris version, calculation version.
   - Numerology: life path, expression/destiny where name is available, soul urge/personality if possible.
   - BaZi: store declared placeholder or P0 calculation only if reliable. Persist calendar basis, timezone source, solar-time policy, computation version.
   - Human Design: do not fake full accuracy. Include design-time architecture and mark advanced outputs as pending unless algorithm is implemented and tested.

5. Dashboard
   - Show core signatures: Sun/Moon/Ascendant, Vedic Moon nakshatra if available, numerology core, declared HD/BaZi status.
   - Show today’s top timing activations.
   - Include one daily reflection prompt.
   - Include data-quality/confidence notes.

6. Timing Lab
   - Daily transit-to-natal activations.
   - Score by orb, aspect type, planetary weight, and confidence.
   - Hard/soft classification.
   - Explain method in plain but serious language.
   - Allow date navigation.

7. Journal
   - CRUD journal entries.
   - Fields: mood 1–10, energy, stress, focus, sleep, relationship pressure, decision confidence, tags, notes.
   - Link each entry to the daily activation set.
   - Add basic pattern review: recent moods, repeated tags, highest-intensity timing days.

8. Reports
   - Generate structured profile report.
   - Generate timing report.
   - Save reports to Supabase.
   - Export report as PDF.
   - Include methodology version and non-claims language in every report.

9. Academy / Methodology
   - Teach symbolic literacy without sounding like a content farm.
   - Include modules for Western chart basics, Vedic basics, timing, journaling calibration, interpretive ethics, and cross-system synthesis.
   - Include clear source/method notes.

10. Practitioner layer foundation
   - Add architecture-ready routes or database models for client profiles, session prep, and client reports, but gate the UI if not ready.
   - Do not imply a marketplace or therapist dashboard in V1.

11. Privacy / settings
   - Data export.
   - Delete profile/account data.
   - Consent language.
   - Birth data and journal privacy explanation.
   - No sale/brokering of personal data.

12. Mystic Sage integration
   - Provide a public Aethos landing path suitable for `mysticsage.xyz/aethos`.
   - Provide a deployable app URL or subdomain target such as `aethos.mysticsage.xyz`.
   - Keep Mystic Sage brand site informational and route cleanly into the app.

Compliance and language constraints:
- Never claim that Aethos predicts events.
- Never give medical, legal, financial, employment, emergency, or therapeutic advice.
- Avoid deterministic language: “guaranteed,” “destined,” “this will happen,” “the universe wants,” “cure,” “diagnose,” “you should invest,” “leave your job/partner,” etc.
- Use confidence labels, data-quality notes, and methodology versioning.
- Make uncertainty visible and useful.

Acceptance criteria:
- `npm install` succeeds.
- `npm run typecheck` succeeds.
- `npm run build` succeeds locally and on Vercel.
- No route renders a blank page.
- No visible button or link is dead.
- Auth, onboarding, profile save, dashboard, timing lab, journal CRUD, report generation, PDF export, settings export/delete, privacy page, and methodology page are usable.
- Supabase RLS prevents public access to private birth data and journal entries.
- Production Vercel deployment loads without framework/output-directory mismatch.
- README and docs accurately describe the actual stack and deployment process.
```
