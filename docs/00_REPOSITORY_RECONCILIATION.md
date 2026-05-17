# Repository Reconciliation Plan — Mystic Sage + Aethos

## Purpose

This document turns the current repository confusion into a launch-ready map. The immediate goal is to clean up `mysticsage.xyz`, reconcile the Aethos specification with the implementation repositories, and avoid shipping claims or functionality that the V1 system cannot support yet.

## Working repository map

| Repository | Working assumption | What to verify | Owner action |
| --- | --- | --- | --- |
| `aethos-v1-spec` | Source of truth for Aethos scope, architecture, non-claims, QA, and launch gates. | Confirm this repo remains spec-only and is not wired to production hosting. | Keep product, API, compliance, and launch checklists here. |
| `mystic-sage-journeys` | Public `mysticsage.xyz` website / marketing repository. | Check DNS, hosting provider, deploy branch, and whether the live site is built from this repo. | Clean navigation, landing copy, footer disclaimers, and Aethos CTA. |
| `aethos-your-inner-compass` | Aethos app or user-facing product implementation repository. | Check whether it contains the runnable frontend/backend, environment variables, and deploy config. | Align implementation to the API, data model, QA, and compliance specs here. |

Treat this map as provisional until each repository's deployment settings are inspected.

## Recommended live product structure

Use one of these patterns and document the decision in `docs/decisions/`:

1. **Conservative launch:** `mysticsage.xyz` remains the brand site; Aethos launches as an application CTA or private beta waitlist.
2. **Subdomain launch:** `aethos.mysticsage.xyz` hosts the Aethos app while `mysticsage.xyz` stays marketing-first.
3. **Integrated launch:** `mysticsage.xyz/aethos` introduces Aethos, then sends approved users into the app.

Recommended V1 choice: **subdomain launch** if `aethos-your-inner-compass` is a runnable app, otherwise **conservative launch** with a waitlist/application flow until the calculation and journaling system passes QA.

## Website cleanup requirements for `mysticsage.xyz`

The public website should be simplified around trust, clarity, and one next step:

- Use a single primary CTA: `Join the Aethos private beta` or `Apply for Aethos`.
- Keep Mystic Sage brand language separate from Aethos product claims.
- Add the required non-claims language to the footer and any Aethos landing page.
- Remove or rewrite deterministic language such as `this will happen`, `destined`, `guaranteed`, or direct advice about health, money, or legal matters.
- Add a short explanation that Aethos provides symbolic timing context for reflection, not event prediction.
- Ensure every page has clear navigation back to Home, Aethos, About, and Contact/Application.
- Verify mobile layout, form submission, analytics events, and thank-you state.

## Aethos live-readiness gates

Aethos should not be promoted as live until these gates pass:

- Canonical birth conversion is timezone-safe and Julian Day output is fixture-tested.
- Western Tropical chart output matches reference fixtures within tolerance.
- Daily timing activations are deterministic, versioned, and ranked by transparent salience logic.
- Journal CRUD works and links entries to daily activation sets.
- Non-claims language appears in onboarding, website footer, settings, and any app-store-style description.
- Privacy policy covers birth data, journal entries, analytics, retention, deletion, and no sale/brokering of personal data.
- QA smoke test passes from public landing page through first journal entry.

## Immediate next actions

1. Inspect `mystic-sage-journeys` for live deployment configuration and current website copy.
2. Inspect `aethos-your-inner-compass` for runnable app status, API compatibility, and missing environment variables.
3. Choose the launch structure: waitlist, subdomain app, or integrated site section.
4. Apply this repository's non-claims copy and banned-phrase scan to all website/app copy.
5. Create a release checklist PR in the live website/app repository once the implementation repo is confirmed.
6. Apply the importer and build-hardening runbook before running the final production import/build.

## Decision record to finalize after verification

Finalize `docs/decisions/ADR-0001-repository-ownership-and-launch-path.md` with:

- Confirmed repository-to-deployment mapping.
- Final domain/subdomain path.
- Required launch gates.
- Rollback owner and procedure.
## Implementation runbooks

- Importer, admin UI, Edge Function, environment-variable, TanStack Router, and CI hardening requirements live in `docs/runbooks/aethos-importer-and-build-hardening.md`.
