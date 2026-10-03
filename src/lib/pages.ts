// The posts, sorted for display. Drafts are included by `npm start` and left
// out of the build.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Sketch = CollectionEntry<'sketches'>;

// Newest first.
export async function getSketches(): Promise<Sketch[]> {
  const sketches = await getCollection('sketches', ({ data }) => import.meta.env.DEV || !data.draft);
  return sketches.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const sketchUrl = (sketch: Sketch) => `/${sketch.id}`;

// "September 26, 2026". Dates are written without a time, which parses as
// midnight UTC, so format in UTC to keep the same day.
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
