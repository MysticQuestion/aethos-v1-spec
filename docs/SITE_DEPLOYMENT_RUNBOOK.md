# Why these changes did not appear on the live site

Short answer: this repository is not the one Vercel deploys for the Mystic Sage website or the Aethos app.

## What this repository is

`aethos-v1-spec` is a specification repository. It stores canonical schemas, architecture documents, and calculation scaffolds.

## What this repository is not

It does **not** include:

- the deployable Mystic Sage frontend,
- the deployable Aethos frontend,
- a `package.json` web build,
- Vercel project settings for either live frontend.

Because of that, commits here will not change the live UI by themselves.

## Where live UI changes must be made

From `README.md`:

- `MysticQuestion/mystic-sage-journeys` → Mystic Sage public site (`mysticsage.xyz`)
- `MysticQuestion/aethos-your-inner-compass` → Aethos app

## What has to happen for changes to appear on the site

1. Copy or implement the relevant docs/spec updates in the actual frontend repo(s).
2. Commit in those repo(s).
3. Push to the branch connected to Vercel (or merge PR into that branch).
4. Ensure Vercel build succeeds.
5. Confirm deployment URL updates and smoke-test routes.

## Quick verification checklist in the frontend repos

- `npm install`
- `npm run build`
- `npm run lint` (if configured)
- `npm run typecheck` (if configured)
- verify deep links resolve on deployed URL
- verify expected pages visually changed

## Common reason this feels confusing

All repos are related to Aethos/Mystic Sage, but only the deployable frontend repos are connected to production hosting.
A spec-repo merge can be complete and correct while producing zero visible site changes.
