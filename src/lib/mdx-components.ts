// The components every .mdx page can use without importing them, plus the
// plain-markdown elements that get the detail-page classes. Passed as
// <Content components={mdxComponents} /> for case studies, projects, and
// .mdx sketches. A new component has to be added here to be usable.
import Callout from '../components/Callout.astro';
import Card from '../components/Card.astro';
import Cards from '../components/Cards.astro';
import Feature from '../components/Feature.astro';
import FeatureList from '../components/FeatureList.astro';
import Figure from '../components/Figure.astro';
import Group from '../components/Group.astro';
import IconCard from '../components/IconCard.astro';
import IconCards from '../components/IconCards.astro';
import ImageGrid from '../components/ImageGrid.astro';
import Note from '../components/Note.astro';
import Section from '../components/Section.astro';
import Storyboard from '../components/Storyboard.astro';
import Video from '../components/Video.astro';
import Divider from '../components/mdx/Divider.astro';
import Label from '../components/mdx/Label.astro';
import List from '../components/mdx/List.astro';
import OrderedList from '../components/mdx/OrderedList.astro';
import Paragraph from '../components/mdx/Paragraph.astro';
import SectionTitle from '../components/mdx/SectionTitle.astro';
import Subtitle from '../components/mdx/Subtitle.astro';

export const mdxComponents = {
  Section,
  Group,
  Note,
  Cards,
  Card,
  Callout,
  IconCards,
  IconCard,
  FeatureList,
  Feature,
  Figure,
  ImageGrid,
  Storyboard,
  Video,
  p: Paragraph,
  h2: SectionTitle,
  h3: Subtitle,
  h4: Label,
  hr: Divider,
  ul: List,
  ol: OrderedList,
};
