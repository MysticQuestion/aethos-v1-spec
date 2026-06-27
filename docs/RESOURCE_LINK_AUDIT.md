# Resource Link Audit

## Scope note

This repository does not contain the Mystic Sage public site resource arrays, workshop cards, route files, or rendered pages. The deployable Mystic Sage site is documented as `MysticQuestion/mystic-sage-journeys`, and the deployable Aethos app is documented as `MysticQuestion/aethos-your-inner-compass`.

This audit therefore defines the inventory method, deduplication rules, schema, and launch-blocking checks that must be run in those repositories.

## Required inventory

Build a machine-readable inventory of:

- All public routes.
- All internal links.
- All external links.
- All download links.
- All workshop links.
- All resource links.
- All repeated cards.
- All repeated CTAs.
- All repeated descriptions.
- All duplicate external PDFs/resources.
- All duplicate blog/resource tags.
- Orphan pages.
- Links to files that do not exist.

## Route list to verify in the app/site repositories

- `/`
- `/about`
- `/aethos`
- `/aethos/app`
- `/aethos/app/generator`
- `/aethos/app/profile`
- `/aethos/app/engine`
- `/aethos/app/timing`
- `/aethos/app/divination-lab`
- `/aethos/app/decision-lens`
- `/aethos/app/learn`
- `/aethos/app/academy`
- `/aethos/app/glossary`
- `/aethos/app/journal`
- `/aethos/app/reports`
- `/aethos/app/methodology`
- `/aethos/app/onboarding`
- `/tools`
- `/tools/astrology`
- `/tools/vedic`
- `/tools/human-design`
- `/tools/bazi`
- `/tools/numerology`
- `/tools/mayan`
- `/tools/tarot`
- `/library`
- `/resources`
- `/workshops`
- `/readings`
- `/blog`
- `/articles`
- `/contact`
- `/auth`
- `/admin`

## Deduplication rules

1. Identical URLs should appear once per intentional context.
2. If a resource and workshop link to the same source, one canonical resource record should be referenced by ID.
3. Similar resources should be merged unless they serve distinct learning levels or traditions.
4. Tags must be normalized to lowercase slugs and human labels.
5. Direct PDF links should be replaced with reputable landing pages where possible.
6. Do not use suspicious PDF mirrors when official publisher, Internet Archive, university, OER, or public-domain records exist.
7. Remove broken, spammy, duplicated, low-quality, or aesthetically poor links.
8. Add `lastReviewed` to external resources.
9. Add `rightsNote` wherever ownership or republication rights could be unclear.
10. Outbound links should open safely with `rel="noreferrer noopener"` when using a new tab.

## Recommended architecture

- `resources.ts`: internal Mystic Sage resources, guides, articles, downloads, and courses.
- `externalResources.ts`: external companion references and archives.
- `workshops.ts`: workshop metadata that references resource IDs, not duplicate URLs.
- `resourceSchema.ts`: TypeScript mirror of the canonical JSON schema.

No duplicate concepts should live in both `resources.ts` and `externalResources.ts` unless intentionally cross-linked.

## Resource metadata

Canonical TypeScript shape:

```ts
type Resource = {
  id: string;
  title: string;
  category: string;
  tradition?: string;
  author?: string;
  sourceName?: string;
  href: string;
  accessType: "internal" | "external" | "download" | "archive" | "article" | "course";
  status: "published" | "in-development" | "reference" | "deprecated";
  level: "start-here" | "intermediate" | "advanced";
  summary: string;
  tags: string[];
  lastReviewed?: string;
  rightsNote?: string;
};
```

## Suggested automated checks

Run in the deployable site repositories:

```bash
rg -n "https?://|href=|to=|Link" src app pages content public
npm run build
npm run lint
npm run typecheck
npx playwright test route-smoke.spec.ts
```

For external links, prefer a small script that deduplicates URLs and performs `HEAD`/`GET` checks with timeouts, while allowing known blocked hosts to be reviewed manually.

## Launch blockers

- Broken primary route.
- Duplicate resource cards with identical URLs and no distinct purpose.
- Direct link to questionable PDF mirror.
- Resource presented as finished but marked only by a thin placeholder.
- Workshop with no purpose, audience, format, status, learning objective, resource link, and next action.
- Supabase query crash on empty/null data.
- Tool labeled “Available” when it requires an unconfigured backend.
