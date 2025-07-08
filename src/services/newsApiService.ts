import type { Article } from "../types/article";
import type { Filter } from "../types/filter";

const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const BASE_URL = "https://newsapi.org/v2/everything";

console.log(API_KEY);

export async function fetchNewsApiArticles(filter: Filter): Promise<Article[]> {
  const params = new URLSearchParams({
    q: filter.keyword || "news",
    from: filter.date || "",
    sortBy: "publishedAt",
    apiKey: API_KEY,
    language: "en",
    pageSize: "20",
  });
  if (filter.source) params.append("sources", filter.source);
  if (filter.category) params.append("category", filter.category);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await res.json();
  if (!data.articles) return [];
  return data.articles.map((a: any, idx: number) => ({
    id: a.url || idx.toString(),
    title: a.title,
    description: a.description,
    url: a.url,
    urlToImage: a.urlToImage,
    publishedAt: a.publishedAt,
    source: a.source?.name || "NewsAPI",
    author: a.author,
    category: filter.category,
  }));
}
