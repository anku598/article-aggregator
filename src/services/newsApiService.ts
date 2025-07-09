import type { Article } from "../types/article";
import type { Filter } from "../types/filter";

const API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const BASE_URL = "https://newsapi.org/v2/everything";
const SOURCES_URL = "https://newsapi.org/v2/sources";

export async function fetchNewsApiArticles(
  filter: Filter,
  page = 1,
  pageSize = 20
): Promise<Article[]> {
  const params = new URLSearchParams({
    q: filter.keyword || "news",
    from: filter.date || "",
    sortBy: "publishedAt",
    apiKey: API_KEY,
    language: "en",
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  // Only add 'sources' if it's a real NewsAPI source ID (not "NewsAPI", "The Guardian", or "NYT")
  const knownApis = ["NewsAPI", "The Guardian", "NYT"];
  if (filter.source && !knownApis.includes(filter.source)) {
    params.append("sources", filter.source);
  }
  // Do NOT add category param for /everything endpoint

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await res.json();
  if (!data.articles) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function fetchNewsApiSources(): Promise<
  { id: string; name: string; category: string }[]
> {
  const params = new URLSearchParams({ apiKey: API_KEY });
  const res = await fetch(`${SOURCES_URL}?${params.toString()}`);
  const data = await res.json();
  if (!data.sources) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.sources.map((s: any) => ({
    id: s.id,
    name: s.name,
    category: s.category,
  }));
}

export function getNewsApiCategories(): string[] {
  // Per NewsAPI docs
  return [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];
}
