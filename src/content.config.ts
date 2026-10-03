import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Posts are posts/<slug>/index.md (or .mdx), with their images beside them.
// The folder name is the post's URL.
const sketches = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      // Shown in the list, the meta description, and link previews.
      summary: z.string(),
      // The link-preview image, next to the post: { src: ./photo.jpg, alt: … }
      cover: z.object({ src: image(), alt: z.string() }).optional(),
      // Short labels on the post's card in the list.
      tags: z.array(z.string()).default([]),
      // Shown by `npm start`, left out of the live site.
      draft: z.boolean().default(false),
    }),
});

export const collections = { sketches };
