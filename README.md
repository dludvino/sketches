# Sketches

The Sketch Book at [sketches.dennisludvino.com](https://sketches.dennisludvino.com):
posts plus the small Astro site that publishes them. It's one of the projects
linked from the hub, [dludvino/base](https://github.com/dludvino/base).

## Writing a post

Each post is a folder under `posts/`. The folder name is the post's URL:

```
posts/
  sketching-with-constraints/
    index.md          → sketches.dennisludvino.com/sketching-with-constraints
    whiteboard.jpg
```

`index.md` starts with a frontmatter block:

```md
---
title: Sketching With Constraints
date: 2026-10-02
summary: One or two sentences for the list and link previews.
draft: true
---

The post, in Markdown.
```

- **`title`**, **`date`** (YYYY-MM-DD), and **`summary`** are required. Posts
  are listed newest first.
- **`draft: true`** keeps a post off the live site. It still shows up when
  you preview locally. Delete the line to publish.
- **`cover`** (optional) is the image shown on the list and in link previews:
  `cover: { src: ./whiteboard.jpg, alt: A whiteboard covered in wireframes }`
- **`tags`** (optional) are short labels on the post's card.

Name the file `index.mdx` instead to use the layout components (image grids,
callouts, and so on). They're copies of the portfolio's, so they work the same
way; see `src/lib/mdx-components.ts` for the list.

## Commands

```
npm install
npm start          # astro dev, http://localhost:3002 (drafts included)
npm run build      # astro build → dist/
npm run check      # build, then scan dist/ for dead links, missing files, etc.
npm run preview    # wrangler dev on http://localhost:8788
```

## Publishing

Pushing to `master` deploys the site (once GitHub is connected to the Worker:
Workers & Pages → `sketches` → Settings → Builds → Connect to Git, production
branch `master`). Until then, run `npx wrangler deploy` by hand.

## Shared look

`src/css/`, `src/components/`, `src/layouts/BaseLayout.astro`, and
`src/plugins/figures.mjs` are copied from
[dludvino/portfolio](https://github.com/dludvino/portfolio), not shared. A style
change in one site doesn't reach the other; make it in both.
