// True when every <li> in a rendered list starts with <strong>.
export function startsWithBold(html: string): boolean {
  const items = html.match(/<li\b[^>]*>\s*(<[a-z]+)?/g) ?? [];
  return items.length > 0 && items.every((item) => item.endsWith('<strong'));
}
