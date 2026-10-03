// Helpers for components that lay out images written as markdown.

// Every <img> tag in rendered HTML, in order.
export function imgTags(html: string): string[] {
  return html.match(/<img\b[^>]*>/g) ?? [];
}

// Adds loading="lazy" to an <img> tag that doesn't set loading itself. Astro
// adds it to the images it optimizes, but not to ones served from public/.
export function lazy(img: string): string {
  return /\sloading=/.test(img) ? img : img.replace(/^<img\b/, '<img loading="lazy"');
}
