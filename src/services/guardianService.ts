import type { Article } from "../types/article";
import type { Filter } from "../types/filter";

const API_KEY = import.meta.env.VITE_GUARDIAN_KEY;
const BASE_URL = "https://content.guardianapis.com/search";
const SECTIONS_URL = "https://content.guardianapis.com/sections";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchGuardianArticles(
  filter: Filter,
  page = 1,
  pageSize = 20
): Promise<Article[]> {
  const params = new URLSearchParams({
    q: filter.keyword || "news",
    "api-key": API_KEY,
    "show-fields": "thumbnail,trailText,byline,bodyText",
    pageSize: pageSize.toString(),
    page: page.toString(),
  });
  if (filter.date) params.append("from-date", filter.date);
  if (filter.category) params.append("section", filter.category);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await res.json();
  if (!data.response?.results) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.response.results.map((a: any) => ({
    id: a.id,
    title: a.webTitle,
    description: a.fields?.trailText || a.fields?.bodyText?.slice(0, 200),
    url: a.webUrl,
    urlToImage: a.fields?.thumbnail,
    publishedAt: a.webPublicationDate,
    source: "The Guardian",
    author: a.fields?.byline,
    category: filter.category,
  }));
}

export async function fetchGuardianSections(): Promise<
  { id: string; webTitle: string }[]
> {
  const params = new URLSearchParams({ "api-key": API_KEY });
  const res = await fetch(`${SECTIONS_URL}?${params.toString()}`);
  const data = await res.json();
  if (!data.response?.results) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.response.results.map((s: any) => ({
    id: s.id,
    webTitle: s.webTitle,
  }));
}
