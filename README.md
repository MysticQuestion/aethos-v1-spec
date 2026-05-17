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
