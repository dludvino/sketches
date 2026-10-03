#!/usr/bin/env node
// Pre-publish sanity check. `npm run check` builds the site, then this scans
// the built pages in dist/ (what actually gets published) for:
//   1. leftover [PLACEHOLDER] text
//   2. literal href="#" dead links
//   3. src="..." / url('...') references that don't resolve to a real file
//   4. href="..." / poster="..." links to a local page or file that doesn't
//      exist, or to a #fragment with no matching id on the target page
//   5. absolute https://sketches.dennisludvino.com/... URLs (og:url, og:image) that
//      don't map to a real file in the repo
//   6. links that end in ".html". Cloudflare redirects /name.html to /name,
//      so pages link to "book-design" and "/#about", not the .html file.
//
// Exits non-zero if anything is found, so it also works as a CI gate.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(ROOT)) {
  console.log('No dist/ folder. Run `npm run check`, which builds the site first.');
  process.exit(1);
}

// Every built page, including ones in folders (sketch-book/<post>.html), as a
// path relative to dist/. Skips _astro/ and assets/, which hold no pages.
const pages = fs
  .readdirSync(ROOT, { recursive: true })
  .filter((f) => f.endsWith('.html') && !/^(_astro|assets)\//.test(f))
  .filter((f) => fs.statSync(path.join(ROOT, f)).isFile());

const SITE_ORIGIN = 'https://sketches.dennisludvino.com';

// Every id="..." on each page, so #fragment links can be checked. Covers every
// built page, since any of them can be a link target.
const idsByPage = new Map();
function idsFor(page) {
  if (!idsByPage.has(page)) {
    const file = path.join(ROOT, page);
    const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    // #top scrolls to the top of any page, even without a matching id.
    const ids = new Set(['top']);
    for (const m of html.matchAll(/\bid="([^"]+)"/g)) ids.add(m[1]);
    idsByPage.set(page, ids);
  }
  return idsByPage.get(page);
}

// Maps a site path to its file the way Cloudflare does: "/" and "" are
// index.html, and "book-design" is book-design.html.
function fileFor(urlPath) {
  const p = decodeURIComponent(urlPath.replace(/^\//, ''));
  if (p === '') return 'index.html';
  if (!path.extname(p) && fs.existsSync(path.join(ROOT, `${p}.html`))) {
    return `${p}.html`;
  }
  return p;
}

let issueCount = 0;

function isLocalRef(ref) {
  return (
    ref &&
    !ref.startsWith('http://') &&
    !ref.startsWith('https://') &&
    !ref.startsWith('mailto:') &&
    !ref.startsWith('data:') &&
    !ref.startsWith('#') &&
    ref.trim() !== ''
  );
}

for (const page of pages) {
  const filePath = path.join(ROOT, page);
  // Inline scripts are code, not content: blank them out (keeping their line
  // breaks) so array brackets in them don't look like [PLACEHOLDER] text.
  const content = fs
    .readFileSync(filePath, 'utf8')
    .replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g, (m, open, body, close) =>
      open + body.replace(/[^\n]/g, '') + close
    );
  const lines = content.split('\n');
  const fileIssues = [];

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    // 1. Leftover placeholder brackets, e.g. [Case Study Title]
    const placeholders = line.match(/\[[^\]]+\]/g);
    if (placeholders) {
      placeholders.forEach((p) =>
        fileIssues.push(`  line ${lineNo}: leftover placeholder ${p}`)
      );
    }

    // 2. Dead "#" links (real in-page anchors always target a specific id)
    if (/href="#"/.test(line)) {
      fileIssues.push(`  line ${lineNo}: href="#" placeholder link`);
    }

    // 3. Broken local file references
    const refs = [
      ...line.matchAll(/\bsrc="([^"]+)"/g),
      ...line.matchAll(/url\(['"]?([^'")]+)['"]?\)/g),
    ].map((m) => m[1]);

    refs.forEach((ref) => {
      if (!isLocalRef(ref)) return;
      const resolved = path.join(ROOT, decodeURIComponent(ref));
      if (!fs.existsSync(resolved)) {
        fileIssues.push(`  line ${lineNo}: missing file ${ref}`);
      }
    });

    // 4. Broken local links and #fragments
    const links = [
      ...line.matchAll(/\b(?:href|poster)="([^"]+)"/g),
    ].map((m) => m[1]);

    links.forEach((link) => {
      if (link === '#') return; // already reported by check 2
      if (link.startsWith(SITE_ORIGIN)) return; // check 5
      if (!link.startsWith('#') && !isLocalRef(link)) return;
      const [target, fragment] = link.split('#');
      const targetPage = link.startsWith('#') ? page : fileFor(target);
      const resolved = path.join(ROOT, targetPage);
      if (/\.html$/.test(target)) {
        fileIssues.push(`  line ${lineNo}: link ends in .html ${link}`);
      }
      if (!fs.existsSync(resolved)) {
        fileIssues.push(`  line ${lineNo}: link to missing file ${link}`);
      } else if (fragment && !idsFor(targetPage).has(fragment)) {
        fileIssues.push(`  line ${lineNo}: link to missing anchor ${link}`);
      }
    });

    // 5. Absolute site URLs that don't match a file in the repo
    const siteUrls = [
      ...line.matchAll(/"(https:\/\/dennisludvino\.com[^"]*)"/g),
    ].map((m) => m[1]);

    siteUrls.forEach((url) => {
      const urlPath = url.slice(SITE_ORIGIN.length).split('#')[0];
      if (/\.html$/.test(urlPath)) {
        fileIssues.push(`  line ${lineNo}: site URL ends in .html ${url}`);
      }
      if (!fs.existsSync(path.join(ROOT, fileFor(urlPath)))) {
        fileIssues.push(`  line ${lineNo}: site URL with no matching file ${url}`);
      }
    });
  });

  if (fileIssues.length) {
    issueCount += fileIssues.length;
    console.log(`\n${page}`);
    fileIssues.forEach((issue) => console.log(issue));
  }
}

if (issueCount === 0) {
  console.log('No placeholder text, dead links, broken anchors, missing assets found.');
  process.exit(0);
} else {
  console.log(`\n${issueCount} issue(s) found.`);
  process.exit(1);
}
