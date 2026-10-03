// The list and every published post, as extensionless URLs (Cloudflare
// redirects /name.html to /name, so only these are listed).
import type { APIRoute } from 'astro';
import { getSketches, sketchUrl } from '../lib/pages';

export const GET: APIRoute = async ({ site }) => {
  const urls = ['/', ...(await getSketches()).map(sketchUrl)].map((path) => new URL(path, site).href);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
