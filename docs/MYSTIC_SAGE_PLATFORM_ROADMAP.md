# Mystic Sage Platform Roadmap

## Current repository audit

This checkout is `MysticQuestion/aethos-v1-spec`, the canonical specification repository for Aethos and its Mystic Sage integration. It is **not** the deployable Mystic Sage public website and it is **not** the deployable Aethos React/Vite app.

Observed state on 2026-05-17:

- No `package.json`, Vite config, Next config, TanStack route tree, Vercel config, or web app route files are present in this repository.
- Deployable implementation repositories are documented in `README.md` as:
  - `MysticQuestion/aethos-your-inner-compass` for the Aethos React/Vite app.
  - `MysticQuestion/mystic-sage-journeys` for the Mystic Sage public site.
- This repository contains product docs, canonical JSON schemas, and Python calculation scaffolds.

Because the deployable site is outside this checkout, route fixes and visual UI changes must be applied in the app/site repositories. This document translates the requested launch plan into implementation requirements those repositories can execute.

## Product position

Mystic Sage is a study platform for symbolic systems, reflective practice, and disciplined self-knowledge. Aethos is the app/workspace layer that turns birth data, timing models, and lived reflection into an auditable profile system.

Interpretation is not authority. It is a structured conversation with evidence, uncertainty, and choice. The platform does not predict a life; it helps people examine timing, pattern, pressure, and possibility.

## Public platform modules

| Module | Launch status | What users can do now | Needed for production launch |
| --- | --- | --- | --- |
| Homepage | Required | Understand Mystic Sage, enter Tools/Aethos/Library/Workshops/Readings | Stable CTAs, SEO metadata, accessible hero, no dependency on Supabase for first paint |
| About / mission | Required | Read platform stance and ethics | Strong mission copy, non-claims statement, cultural specificity |
| Tools hub | Required | Discover available and planned symbolic tools | Honest status badges, no dead links, no duplicate cards |
| Free library | Required | Browse curated internal and external resources | Resource schema, link audit, rights notes, last-reviewed dates |
| Resource archive | Required | Search and filter posts/resources | Supabase fallback, normalized tags, empty states |
| Workshops | Required | See curriculum paths and current availability | Workshop metadata, detail stubs for in-development curricula |
| Readings | Required | Request or join waitlist for sessions | Real form behavior, clear scope, disclaimers, no pressure-sales copy |
| Blog/articles | Required | Read public editorial content | Slug validation, empty-state handling, archive search |
| Contact/waitlist | Required | Submit interest and support requests | Supabase/table or form endpoint, success/failure states |
| Shop/digital products | Planned | Browse future products | Stripe, product tables, fulfillment, entitlement checks |
| Newsletter | Planned | Subscribe to updates | Email provider, consent records, unsubscribe flow |
| Admin CMS | Planned | Manage posts/resources/workshops | Admin auth, RLS, validation schemas, audit log |
| Privacy/Terms | Required before launch | Understand data use and boundaries | Legal review, data deletion/export workflows |
| Accessibility/mobile | Required | Use across devices and assistive tech | WCAG pass, keyboard navigation, contrast review |
| SEO/OG images | Required | Share pages with accurate previews | Route metadata, OG image pipeline, canonical URLs |

## Chart and symbolic tools

| Tool | Launch posture | Required backend / data |
| --- | --- | --- |
| Western tropical astrology | Engine-wired, not client-invented | Swiss Ephemeris or pyswisseph, IANA timezone handling, geocoding, house-system support, golden chart fixtures |
| Sidereal astrology | Engine-wired | Ayanamsa support, sidereal fixtures, clear tropical/sidereal distinction |
| Vedic/Jyotisha chart layouts | Research/prototype | Lahiri defaults, nakshatra logic, divisional chart policy, terminology review |
| Human Design | Scaffold/prototype | Mandala gate wheel mapping, design time, bodygraph rules, fixtures against references |
| BaZi/Four Pillars | Scaffold/prototype | Solar-term calculation, timezone handling, pillar fixtures, luck pillar roadmap |
| Gene Keys | Overlay/reference | Gate mapping source, rights posture, careful language boundaries |
| Numerology | Available if calculator implemented | Pythagorean/Chaldean mappings, master number policy, test cases |
| Tarot | Available if local draw implemented | Local deck data, optional edge-function interpretation, graceful fallback |
| Mayan calendar research | Research phase | Source review, cultural consultation, no flattened appropriation |
| Astrocartography | Planned | Great-circle line calculations, map library, geocoding, cache |
| Transit calculator | Planned | Event-window service, exact hit detection, confidence scoring |
| Synastry/composite charts | Planned | Multi-profile consent, aspect engine, relationship interpretations |
| Solar/lunar returns | Planned | Return chart calculations, timezone/geolocation policy |
| Progressions | Planned | Secondary progression calculations and fixtures |
| Profections | Planned | Annual profection logic and educational framing |
| Dasha timelines | Planned | Vedic timing method scope and source review |
| BaZi luck pillars | Planned | Solar-term precision and decade pillar calculations |

## Aethos app/workspace modules

| Module | Launch posture | Needed to run smoothly |
| --- | --- | --- |
| User dashboard | Required | Auth state handling, profile empty state, timing preview fallback |
| Unified generator | Required | Canonical intake schema, chart-engine API, payload preview |
| Symbolic profile | Required | Saved chart snapshots, data-quality notes, versioned calculation results |
| Aethos Core Reading | Planned | Report templates, interpretation retrieval, citations, storage |
| Timing intelligence | Required | Transit windows, start/peak/end dates, confidence labels |
| Journal | Required | `journal_entries` table, tags, privacy controls, export/delete |
| Calibration check-ins | Required | `calibration_entries` table, sliders, local fallback or clear auth requirement |
| Reports | Planned | Report storage, PDF renderer, template versioning |
| Decision Lens | Prototype | Ethical decision framing, no deterministic recommendation claims |
| Divination Lab | Prototype | Tarot/I Ching boundaries, fallback state, no authority language |
| Academy / Learn | Planned | Course schema, lesson renderer, progress tracking |
| Glossary | Required | Source-aware definitions, tag taxonomy, editorial review |
| Methodology | Required | Calculation/interpretation separation, versioned assumptions |
| Scholar/research mode | Planned | Citations, source records, confidence annotations |
| Onboarding | Required | Consent, birth intake, time confidence, privacy copy |
| Profile vault | Planned | Multiple profiles, consent, saved charts/readings |
| Export/delete data | Required before scale | Privacy controls, data export formats, deletion job |

## Relationship tools

Planned features: synastry, composite chart, Davison chart, bond profile, communication map, conflict/repair map, friendship/family/business modes, and consent-based sharing.

Needed: multiple profiles per user, invitation flow, chart-to-chart aspect engine, relationship interpretation records, privacy controls, and revocable sharing permissions.

## Astrocartography

Planned features: map, ASC/DSC/MC/IC lines, clickable planetary lines, relocation charts, city comparison, saved locations, and travel mode.

Needed: great-circle calculations, map library, geocoding, line cache, interpretation snippets, and performance optimization.

## Education / Academy

Planned features: course schema, modules, lessons, quizzes, downloadable workbooks, progress tracking, certificates, chart-based lessons, and workshop cohorts.

Needed: course tables, lesson renderer, completion state, resource downloads, enrollment logic, and admin CMS.

## Commerce

Planned features: readings booking, workshop enrollment, paid reports, digital downloads, shop, subscriptions, practitioner tier, white-label widgets, and API tier.

Needed: Stripe, product/pricing tables, entitlements, booking/scheduling, receipts, cancellation/refund policy, protected paid content, and tax/accounting review.

## Community / public sharing

Planned features: shareable profile, anonymous chart gallery, moderated discussion, workshop cohorts, practitioner directory, and embeddable widgets.

Needed: public/private permissions, anonymization pipeline, moderation tools, share tokens, API keys, and rate limiting.

## Admin / editorial

Planned features: post editor, resource editor, workshop editor, glossary editor, interpretation editor, external link manager, waitlist viewer, reading request manager, file manager, and audit log.

Needed: admin auth, role permissions, Supabase RLS, validation schemas, preview mode, and audit log.

## Priority sequence

1. Working site and deep-link stability.
2. Honest feature states and graceful fallbacks.
3. Refined noir/minimal design system.
4. Clean resource/workshop inventory.
5. Clear Aethos architecture and API contracts.
6. Future-ready roadmap and implementation docs.
