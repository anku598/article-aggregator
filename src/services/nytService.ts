import type { Article } from "../types/article";
import type { Filter } from "../types/filter";

const API_KEY = import.meta.env.VITE_NYT_KEY;
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

export async function fetchNytArticles(filter: Filter): Promise<Article[]> {
  const params = new URLSearchParams({
    q: filter.keyword || "news",
    begin_date: filter.date ? filter.date.replace(/-/g, "") : "",
    "api-key": API_KEY,
    sort: "newest",
    fl: "web_url,snippet,headline,pub_date,byline,multimedia,_id",
    page: "0",
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await res.json();
  if (!data.response?.docs) return [];
  return data.response.docs.map((a: any) => ({
    id: a._id,
    title: a.headline?.main,
    description: a.snippet,
    url: a.web_url,
    urlToImage: a.multimedia?.length
      ? `https://www.nytimes.com/${a.multimedia[0].url}`
      : undefined,
    publishedAt: a.pub_date,
    source: "NYT",
    author: a.byline?.original,
    category: filter.category,
  }));
}
