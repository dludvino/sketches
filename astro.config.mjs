// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import figures from './src/plugins/figures.mjs';

// Static build into dist/, which wrangler.jsonc publishes. `format: 'file'` writes book-design.html rather than
// book-design/index.html, so URLs stay extensionless (/book-design) the way
// Cloudflare serves them, with no trailing slash.
export default defineConfig({
  site: 'https://sketches.dennisludvino.com',
  integrations: [mdx()],
  // IBM Plex Sans is downloaded from Google Fonts at build time and served
  // from the site itself, with the weights the header and hero use first
  // preloaded (see <Font> in BaseLayout.astro). Loading it through an @import
  // in the CSS made every page render in a fallback font first and then swap,
  // which flickered the header on each page change.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-plex-sans',
      weights: [300, 400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  markdown: {
    processor: satteri({ hastPlugins: [figures] }),
  },
  trailingSlash: 'never',
  // Keep the built HTML readable (and npm run check's line numbers useful).
  compressHTML: false,
  build: {
    format: 'file',
  },
  server: {
    port: 3002,
  },
  vite: {
    build: {
      rolldownOptions: {
        // Astro marks every .mdx module with a "use astro:head-inject"
        // directive, which the bundler warns about once per page. Harmless.
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('astro:head-inject')) return;
          warn(warning);
        },
      },
    },
  },
});
