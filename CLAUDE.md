# CLAUDE.md

## What this is

The Sketch Book: an Astro 7 static site (Cloudflare Worker with static assets) at
sketches.dennisludvino.com, with the posts in `posts/<slug>/index.md[x]`. It used to
be a content-only repo that the portfolio built into `/sketch-book`; it's now
standalone. Linked from the hub (dludvino/base) and the portfolio's banner.

## Commands

See README.md. Run `npm run check` before pushing.

## Architecture

- `src/content.config.ts`: the `sketches` collection (frontmatter schema), read from `posts/`.
- `src/pages/index.astro`: the card grid at `/`. `src/pages/[slug].astro`: one post at `/<slug>`.
- `src/lib/pages.ts`: `getSketches()` (newest first; drafts only in dev), `sketchUrl`, `formatDate`. Use these rather than `getCollection`.
- `src/components/`, `src/css/`, `src/plugins/`, `src/layouts/BaseLayout.astro`, `src/lib/mdx-components.ts`, `src/js/`: copied from the portfolio, trimmed to what posts use. Not a shared package by choice; when the portfolio's styles change, copy the change here by hand.
- `Banner.astro` here is its own (logo, Portfolio, All projects, email); the Footer text is adjusted.
- `wrangler.jsonc`: Worker `sketches`, custom domain sketches.dennisludvino.com. Default branch is `master`.
