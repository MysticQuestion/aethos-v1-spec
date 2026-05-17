# ADR-0001 — Repository Ownership and Launch Path

## Status

Proposed pending verification of GitHub deployment settings, DNS, and hosting configuration.

## Context

The Aethos work is currently split across at least three repository names: `aethos-v1-spec`, `mystic-sage-journeys`, and `aethos-your-inner-compass`. The live domain `mysticsage.xyz` needs cleanup, and the Aethos system needs a controlled path to become public without confusing specification artifacts, marketing copy, and production code.

## Decision

Until deployment settings prove otherwise:

1. `aethos-v1-spec` remains the source-of-truth specification repository.
2. `mystic-sage-journeys` is treated as the public Mystic Sage website repository.
3. `aethos-your-inner-compass` is treated as the Aethos app/product implementation repository.
4. Aethos should launch either on a subdomain such as `aethos.mysticsage.xyz` or behind a private beta/application CTA from `mysticsage.xyz`.
5. Public website copy and app copy must follow the non-claims framework before going live.

## Rationale

This split keeps responsibilities clear:

- The specification repository defines product scope, technical contracts, QA gates, and prohibited claims.
- The website repository owns brand presentation, landing pages, navigation, CTAs, footer language, and forms.
- The app repository owns user accounts, birth profile flow, calculations, timing views, journaling, and storage.

A subdomain or private beta launch prevents the public site from implying that the full Aethos engine is production-ready before calculation accuracy, journaling, privacy, and compliance gates pass.

## Consequences

- Website cleanup can proceed without pretending the app is fully launched.
- Implementation work can be measured against explicit launch gates in this spec.
- Any repository mapping discovered during verification must update `README.md` and `docs/00_REPOSITORY_RECONCILIATION.md`.
- The final launch PR must include a smoke-test path from landing page to onboarding/application and, when the app is ready, first journal entry.

## Verification checklist

- [ ] Confirm `mysticsage.xyz` DNS target.
- [ ] Confirm hosting provider and deploy source for the live website.
- [ ] Confirm whether `mystic-sage-journeys` deploys the live site.
- [ ] Confirm whether `aethos-your-inner-compass` is the runnable app.
- [ ] Confirm production/staging environment variables and secrets ownership.
- [ ] Confirm rollback procedure and owner.
