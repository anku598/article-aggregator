import type { Article } from "../types/article";
import type { Filter } from "../types/filter";

const API_KEY = import.meta.env.VITE_GUARDIAN_KEY;
const BASE_URL = "https://content.guardianapis.com/search";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export async function fetchGuardianArticles(
  filter: Filter
): Promise<Article[]> {
  const params = new URLSearchParams({
    // q: filter.keyword || "news",
    // "from-date": filter.date || "",
    "api-key": API_KEY,
    // "show-fields": "thumbnail,trailText,byline,bodyText",
  });
  if (filter.category) params.append("section", filter.category);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await res.json();
  if (!data.response?.results) return [];
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
