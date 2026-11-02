# ADR-0002: Aethos-first mobile product

Date: November 1, 2026 (America/Los_Angeles)
Status: Product direction accepted from the user's development directive; native release remains unvalidated.

## Decision

Aethos is Mystic Sage's flagship consumer application. It owns onboarding, the opening screen, personal records, interpretation, timing exploration and private reflection. Mystic Sage owns publishing, scholarship and the wider public website. Mystic Noir and the chakra curriculum support Aethos through explicitly authored resource associations.

Positioning: **Know your patterns. Understand your timing. Examine your becoming.**

Five sections: Today, Identity, Cycles, Reflect, Explore. The central journey is birth intake → traceable personal profile → calculated current cycle → voluntary observation → later review, without a required account.

The current user directive supersedes conflicting stack, surveillance, forecasting and product-hierarchy assumptions in earlier research. It does not establish that any prototype is verified or that astrology predicts psychological outcomes.

## Repository responsibilities

| Repository | Role |
| --- | --- |
| aethos-v1-spec | Canonical requirements, contracts, decisions, validation criteria |
| the-aethos-app | Candidate native foundation, subject to completion and validation |
| aethos-your-inner-compass | Existing web application; source of reusable, validated modules |
| mystic-sage-journeys | Public site, scholarship and contextual resources |

Expo is the candidate native framework. No framework migration or production deployment is authorized by this decision. Changes belong on a development branch. Do not use Lovable credits. Do not copy browser-auth assumptions or plaintext storage into native mobile.

## Evidence hierarchy

1. Current explicit user requirements.
2. Tested source behavior at a recorded commit.
3. Canonical specifications reconciled with those requirements.
4. Project research as context, with unsupported claims kept out of product promises.

Separate astronomical calculations, traditional interpretations, user reports and speculative synthesis. Do not collapse them into a single scientific confidence percentage. Interpretive agreement is not validation of astrology. Missing evidence produces an unavailable or qualified output.

## Research reconciliation

Reviewed project sources:

- `Aethos Astrology Intelligence Platform in 2026_ Architecture, Differentiation, and Defensible Moats.pdf` (12 pages).
- `Advanced Astrology Intelligence and Human Simulation_ A Strategic Briefing.pdf` (19 pages; includes duplicated fiction-generation material).
- `Horoscope_to_Timing_Intelligence.pdf` (15 image-based slides, inspected through local OCR).
- `unnamed (8).png` (strategy infographic, visually reviewed).

| Source idea | Decision |
| --- | --- |
| Separate calculation, interpretation and timing | Retain as module boundaries; no mandatory distributed services |
| Astro-Integration Kernel and five thematic domains | Retain as design vocabulary; scores require documented rules and provenance |
| Story Mode and Lab Mode | Adapt to readable insight plus optional method/source details |
| Swiss Ephemeris | Candidate requiring explicit engine selection, licensing review and fixtures; not an installed capability claim |
| Historical timezone provenance | Required; runtime timezone data and reproducibility must be recorded |
| Next.js / GraphQL / multiple databases | Not mandatory; inspect actual repositories and justify additional infrastructure |
| Multi-agent writing and reinforcement learning | Deferred; narrative research does not validate personal interpretation accuracy |
| EMA-style voluntary observation | Retain as optional self-report, separate from clinical measurement |
| Passive sensors and digital phenotyping | Excluded from MVP |
| Fibonacci/synchronicity probability windows | Research-only; not eligible for prediction or confidence claims |
| A proprietary journal dataset as a competitive advantage | Replace with user control, portability and trusted methods; no implied research reuse |
| Market sizes, vendor prices, gross margins | Historical research assumptions; not reverified here and not approved launch claims |
| “100% accuracy,” “87% confidence,” guaranteed outcomes | Excluded without defined measurement and independent validation |

## MVP and expansions

P0: explicit privacy choices; reliable date/place/time intake; independently validated Western calculations; sourced identity interpretations; actual transit windows; five accessible sections; encrypted private journal; offline saved reports; export/import/correction/deletion; migration and recovery behavior.

Numerology may ship only with a named method, fixtures and sourced interpretive content. Its inclusion must not delay correction of birth-time or storage defects.

P1: historical timing comparison; selected Mystic Noir and workshop integrations; consented relationship analysis.

P2: Vedic, BaZi, Human Design and other systems after independent method validation; audio, advanced reports, optional encrypted synchronization; practitioner workflows.

No clinical scores, passive collection, public feed, streaks or manipulative notifications are required. Use charcoal/obsidian, restrained gold, readable typography, deliberate spacing, reduced motion and accessible text scaling.

## Data and privacy requirements

- One stable local subject identifier; preserve original intake and version corrections.
- Store birth-time source and uncertainty, original local time, coordinates, IANA zone, timezone-data provenance, UTC resolution and calculation settings.
- Unknown time stays null. Do not create a noon chart and present its angles or houses as personal facts.
- Repeated local times require explicit disambiguation; nonexistent local times require correction.
- Distinguish unknown-time support from full-day sensitivity calculations, which are still needed.
- Approximate time must propagate through a sensitivity interval; do not present precise houses merely because a nominal instant resolves.
- Every chart has engine/version/settings/reference-frame provenance. Every insight has interpretation version, source IDs, evidence classification and limitations.
- Consent for local storage, optional cloud sync, AI transmission and journal analysis must be separate and revocable. A stored boolean alone is not informed consent: record the presented notice version and timestamp when UI is implemented.
- Encryption includes records, indexes, exports and backup behavior. Device-managed keys, restart recovery and key loss need tests. Do not describe AsyncStorage as encrypted.
- Import is validated and transactional; malformed archives do not replace the active store. Corrections do not erase journal history.
- No private journal data enters remote AI, logs or analytics without the required specific permission.

## Next engineering sequence and acceptance evidence

1. **Intake foundation:** schema/runtime validation, DST/gap cases, unknown-time preservation. New module delivered in the native development branch; not yet connected to onboarding.
2. **Calculation certification:** choose engine and supported settings; test independent reference charts and historical dates; reject unsupported settings; remove sample-generated outputs from user paths. Existing golden files are not independent evidence by themselves.
3. **Secure local persistence:** encrypted database plus device-secured key; transactional schema migration, corruption handling, import/export, deletion and backup controls. Recovery tested before collecting real journals.
4. **Native routes:** restore/create Expo app routes and TypeScript configuration; build Today/Identity/Cycles/Reflect/Explore against the validated contracts. Do not integrate the legacy provider unchanged.
5. **Interpretation:** authored source catalog, bounded synthesis, explicit labels, disagreement/save/annotation/dismissal; retain historical insight versions.
6. **Release validation:** native build on both platforms; physical Android/iOS journey; offline restart and update; accessibility and privacy checks; documented limitations and release notes.

Release requires all ten user journey steps in the development directive, including export/import and update without loss. Unit tests for intake do not certify astronomy, storage, UI, security or the release.

## Status vocabulary

Implemented: present in source. Tested: named checks passed in a specified environment. Blocked: an identified dependency or defect prevents acceptance. Deferred: intentionally outside the current milestone. Never equate planned or simulated behavior with a release candidate.
