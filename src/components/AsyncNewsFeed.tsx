import { getNews } from '@/lib/news';
import NewsFeed from '@/components/NewsFeed';

export default async function AsyncNewsFeed() {
  const news = await getNews(40);
  if (news.length === 0) return null;
  return <NewsFeed items={news} />;
}
