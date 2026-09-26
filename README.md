# Sketches

The posts for the Sketches section of [dennisludvino.com](https://dennisludvino.com/sketches).
The portfolio site ([dludvino/portfolio](https://github.com/dludvino/portfolio))
pulls this repo in every time it builds, so publishing a post is just
pushing it here.

## Writing a post

Each post is a folder under `posts/`. The folder name is the post's URL:

```
posts/
  sketching-with-constraints/
    index.md          → dennisludvino.com/sketches/sketching-with-constraints
    whiteboard.jpg
```

`index.md` starts with a frontmatter block:

```md
---
title: Sketching With Constraints
date: 2026-10-02
summary: One or two sentences for the Sketches list and link previews.
draft: true
---

The post, in Markdown.
```

- **`title`**, **`date`** (YYYY-MM-DD), and **`summary`** are required. Posts
  are listed newest first.
- **`draft: true`** keeps a post off the live site. It still shows up when
  you preview locally. Delete the line to publish.
- **`cover`** (optional) is the image shown in link previews:
  `cover: { src: ./whiteboard.jpg, alt: A whiteboard covered in wireframes }`

### Formatting

Standard Markdown: paragraphs, `## headings`, `**bold**`, `*italic*`,
`[links](https://…)`, lists, `> quotes`, and `---` dividers. Straight quotes
become curly ones automatically.

**Images** go in the post's folder, referenced with `./`:

```md
![Describe the image](./whiteboard.jpg "Optional caption")
```

An image on its own line becomes a figure with its title as the caption, and
opens in a lightbox when clicked. The site compresses images when it builds,
but export at most 2400px wide. Name files in kebab-case with no spaces.

For the portfolio's layout components (image grids, callouts, and so on),
name the file `index.mdx` instead. They're described in the portfolio repo's
README.

## Previewing locally

Keep this repo cloned inside the portfolio folder, as `sketches/`. The
portfolio ignores that folder, so the two repos stay separate: run `git`
here for posts, and in the portfolio folder for the site.

```
cd portfolio
git clone https://github.com/dludvino/sketches.git sketches
npm start
```

The portfolio finds the clone on its own and shows posts as you save,
drafts and unpushed edits included. Its `npm run check` checks them too.
(A clone somewhere else works with `SKETCHES_DIR=path/to/sketches npm start`.)

## Publishing

Push to `master`. The GitHub Action in `.github/workflows/deploy.yml` calls
the portfolio's Cloudflare Deploy Hook, which rebuilds the site with the new
post, usually within a couple of minutes.

One-time setup: in Cloudflare, go to Workers & Pages → the `portfolio`
Worker → Settings → Builds → Deploy Hooks, create a hook for the `main`
branch, and copy its URL. Then in this repo on GitHub, go to Settings →
Secrets and variables → Actions and add it as a secret named
`CLOUDFLARE_DEPLOY_HOOK`. The URL is the only credential the hook needs, so
keep it secret.
