# Content Quality Standard

## Standard

Mystic Sage and Aethos content must be useful, specific, honest, culturally careful, and visually consistent. No page should pretend that an unfinished feature is complete.

Every page, tool, resource, or workshop must pass these questions:

1. Is this useful on its own?
2. Is the content specific enough to guide action or study?
3. Does every link resolve?
4. Is the resource worthy of inclusion?
5. Are claims accurate and bounded?
6. Is each tradition represented with respect and specificity?
7. Does the page match the design system?
8. Does the user know what is live versus in development?
9. Is there a clear next action?
10. Are ethical boundaries visible without being intrusive?

## Required metadata

### Resources

Use the canonical resource schema in `schemas/canonical/mystic_sage.resource.v1.json`.

Required fields:

- `id`
- `title`
- `category`
- `href`
- `accessType`
- `status`
- `level`
- `summary`
- `tags`

Recommended fields:

- `tradition`
- `author`
- `sourceName`
- `lastReviewed`
- `rightsNote`

### Workshops

Each workshop card/detail page must include:

- Purpose.
- Audience.
- Format.
- Status.
- Difficulty.
- Time required.
- Learning objective.
- Resource link.
- Next action.
- What is live now.
- What comes later.
- Whether a backend/API is required.

### Tools

Each tool card must include:

- Status: `Available`, `Engine wired`, `Tool prototype`, `Research phase`, `Requires backend`, or `In development`.
- Systems/traditions involved.
- Inputs required.
- Outputs available now.
- Backend dependency.
- Ethical boundary statement.

## Status language

Use honest labels:

- **Published**: complete enough for public use.
- **In development**: visible roadmap or stub, not a finished product.
- **Reference only**: useful as a companion source, not Mystic Sage-owned teaching.
- **Method preview**: explains intended method without full tooling.
- **Tool prototype**: UI or local-only logic is available, but production backend is incomplete.
- **Requires backend**: form/UI exists, but output depends on an API not yet deployed.
- **Coming after chart engine deployment**: blocked by deterministic calculation service.

## Copy tone

Preferred language:

- “Mystic Sage is a study platform for symbolic systems, reflective practice, and disciplined self-knowledge.”
- “Aethos turns birth data, timing models, and lived reflection into an auditable profile system.”
- “Interpretation is not authority. It is a structured conversation with evidence, uncertainty, and choice.”
- “The platform does not predict your life. It helps you examine timing, pattern, pressure, and possibility.”
- “Use the tools. Study the method. Keep your agency.”

Avoid vague or theatrical language such as: cosmic, magic, fate, destiny, manifest, portal, veil, awakening, tapestry, whispers, ethereal, realm, shimmer, downloads, high vibration, or similar copy unless quoted in a historical/source context.

## Cultural and rights standards

- Prefer official publisher pages, university pages, public-domain repositories, Internet Archive records, OER sources, and living-tradition organizations.
- Avoid suspicious PDF mirrors.
- Do not embed or rehost external PDFs unless rights are clear.
- Add a rights note for archive/reference materials.
- Use specific tradition names where appropriate; avoid flattening distinct systems into generic spirituality.
- For indigenous or living traditions, use extra caution and source from accountable organizations or practitioners.

## Empty states

Empty states should be calm and useful. They should say what happened, why it may be empty, and what the user can do next.

Example:

> No resources matched this filter. Try a broader tag, or return to the full archive.

## Error states

Errors should not dramatize failure.

Tarot/interpretation fallback:

> The interpretation service is unavailable. Your card draw is still shown below.

Chart-engine fallback:

> The chart engine is not connected in this environment. Your intake payload is shown below so you can verify the data before calculation.
