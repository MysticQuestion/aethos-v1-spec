# Aethos Implementation Notes

## What was built here

Because the primary frontend repository could not be cloned from this environment, this repository now includes a portable Vite/TypeScript Aethos MVP implementation that can be copied or cherry-picked into `MysticQuestion/aethos-your-inner-compass`.

Implemented MVP capabilities:

- Public landing page.
- Onboarding route with birth intake, intention, and preferred systems.
- Dashboard route with profile, timing, journal, report, and reflection cards.
- Profile route with identity summary, strengths, growth edges, timing sensitivities, and prompts.
- Journal route with local persistence and theme extraction.
- Reports route with deterministic Markdown report generation.
- Methodology route with responsible-use language.
- Settings route with storage mode and local data reset.
- Stabilized placeholders for secondary routes.

## Deferred work

- Real chart engine integration.
- Supabase table persistence.
- Supabase Auth.
- PDF export.
- Practitioner account controls.
- Advanced Vedic, BaZi, I Ching, relationship, and team analytics.

## Known limitation

This implementation is committed in the specification repository because direct GitHub cloning of `MysticQuestion/aethos-your-inner-compass` failed from the execution environment with a network 403. It should be ported to the frontend repository to affect production deployment.
