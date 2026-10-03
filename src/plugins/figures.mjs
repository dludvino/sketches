// A Sätteri (Astro's Markdown processor) plugin that turns an image sitting
// alone in its own paragraph into a detail-page figure, with the image title
// as its caption:
//
//   ![Alt text](./screenshot.png "Caption text")
//
// becomes
//
//   <figure class="case-study-figure">
//     <div class="case-study-figure__media"><img …></div>
//     <figcaption class="case-study-figure__caption">Caption text</figcaption>
//   </figure>
//
// A paragraph holding only images, one per line, becomes a row of them
// (the same .case-study-image-grid that <ImageGrid> writes), 2 to 4 across:
//
//   ![First](./a.jpg)
//   ![Second](./b.jpg)
//   ![Third](./c.jpg)
//
// becomes
//
//   <div class="case-study-image-grid case-study-image-grid--row case-study-image-grid--cols-3" role="list">
//     <figure class="case-study-image-grid__item" role="listitem"><img …></figure>
//     …
//   </div>
//
// For the other figure styles (plain, padded, crop, …) wrap the image in
// <Figure> instead (src/components/Figure.astro). Images inside <Figure>,
// <ImageGrid>, and <Storyboard> are left alone: those components lay out
// their own images.

const LAYS_OUT_IMAGES = new Set(['Figure', 'ImageGrid', 'Storyboard']);

const isBlank = (node) => node.type === 'text' && !node.value.trim();
const isImage = (node) => node.type === 'element' && node.tagName === 'img';

// Astro adds loading="lazy" to images it optimizes, not to public/ ones.
const lazy = (img) => ({ ...img, properties: { loading: 'lazy', ...img.properties } });

function imageRow(images) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: [
        'case-study-image-grid',
        'case-study-image-grid--row',
        `case-study-image-grid--cols-${Math.min(images.length, 4)}`,
      ],
      role: 'list',
    },
    children: images.map((img) => {
      const { title, ...properties } = lazy(img).properties;
      return {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['case-study-image-grid__item'], role: 'listitem' },
        children: [{ ...img, properties }],
      };
    }),
  };
}

function insideImageLayout(node, ctx) {
  for (let parent = ctx.parent(node); parent; parent = ctx.parent(parent)) {
    if (parent.type === 'mdxJsxFlowElement' && LAYS_OUT_IMAGES.has(parent.name)) return true;
  }
  return false;
}

export default {
  name: 'figures',
  element: {
    filter: ['p'],
    visit(paragraph, ctx) {
      const content = paragraph.children.filter((child) => !isBlank(child));
      if (content.length === 0 || !content.every(isImage)) return;
      if (insideImageLayout(paragraph, ctx)) return;
      if (content.length > 1) {
        ctx.replaceNode(paragraph, imageRow(content));
        return;
      }

      const [img] = content;
      const { title: caption, ...properties } = lazy(img).properties;
      const children = [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['case-study-figure__media'] },
          children: [{ ...img, properties }],
        },
      ];
      if (caption) {
        children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: { className: ['case-study-figure__caption'] },
          children: [{ type: 'text', value: String(caption) }],
        });
      }
      ctx.replaceNode(paragraph, {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['case-study-figure'] },
        children,
      });
    },
  },
};
