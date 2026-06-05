import { getHighlights } from '@/lib/highlights';
import HighlightsFeed from '@/components/HighlightsFeed';

export default async function AsyncHighlightsFeed() {
  const items = await getHighlights(24);
  if (items.length === 0) return null;
  return <HighlightsFeed items={items} />;
}
