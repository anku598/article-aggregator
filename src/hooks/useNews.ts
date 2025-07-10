import { useCallback } from "react";
import { useNewsContext } from "../context/useNewsContext";
import { fetchNewsApiArticles } from "../services/newsApiService";
import { fetchGuardianArticles } from "../services/guardianService";
import { fetchNytArticles } from "../services/nytService";

function formatNytDate(date: string | undefined) {
  if (!date) return undefined;
  // NYT expects YYYYMMDD
  return date.replace(/-/g, "");
}

// In-memory cache: { [key: string]: { data: Article[], timestamp: number } }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CACHE: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCacheKey(api: string, filter: any) {
  return api + ":" + JSON.stringify(filter);
}

export function useNewsFetcher() {
  const { filter, preferences, setArticles, setLoading, newsApiSources } =
    useNewsContext();

  const fetchAllArticles = useCallback(async () => {
    setLoading(true);
    try {
      let sourcesToFetch: string[] = [];
      if (filter.source) {
        const isNewsApiSource = newsApiSources.some(
          (s) => s.id === filter.source
        );
        if (isNewsApiSource) {
          const cacheKey = getCacheKey("newsapi", {
            ...filter,
            source: filter.source,
          });
          const cached = CACHE[cacheKey];
          if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setArticles(cached.data);
            setLoading(false);
            return;
          }
          const articles = await fetchNewsApiArticles({
            ...filter,
            source: filter.source,
          });
          CACHE[cacheKey] = { data: articles, timestamp: Date.now() };
          setArticles(articles);
          setLoading(false);
          return;
        } else if (filter.source === "The Guardian") {
          const cacheKey = getCacheKey("guardian", filter);
          const cached = CACHE[cacheKey];
          if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setArticles(cached.data);
            setLoading(false);
            return;
          }
          const articles = await fetchGuardianArticles(filter);
          CACHE[cacheKey] = { data: articles, timestamp: Date.now() };
          setArticles(articles);
          setLoading(false);
          return;
        } else if (filter.source === "NYT") {
          const nytFilter = { ...filter, date: formatNytDate(filter.date) };
          const cacheKey = getCacheKey("nyt", nytFilter);
          const cached = CACHE[cacheKey];
          if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setArticles(cached.data);
            setLoading(false);
            return;
          }
          const articles = await fetchNytArticles(nytFilter);
          CACHE[cacheKey] = { data: articles, timestamp: Date.now() };
          setArticles(articles);
          setLoading(false);
          return;
        }
      }
      if (preferences.sources.length > 0) {
        sourcesToFetch = preferences.sources;
      } else {
        sourcesToFetch = ["NewsAPI", "The Guardian", "NYT"];
      }
      const promises = [];
      const cacheKeys: string[] = [];
      if (sourcesToFetch.includes("NewsAPI")) {
        const cacheKey = getCacheKey("newsapi", filter);
        cacheKeys.push(cacheKey);
        const cached = CACHE[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          promises.push(Promise.resolve(cached.data));
        } else {
          promises.push(
            fetchNewsApiArticles(filter).then((data) => {
              CACHE[cacheKey] = { data, timestamp: Date.now() };
              return data;
            })
          );
        }
      }
      if (sourcesToFetch.includes("The Guardian")) {
        const cacheKey = getCacheKey("guardian", filter);
        cacheKeys.push(cacheKey);
        const cached = CACHE[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          promises.push(Promise.resolve(cached.data));
        } else {
          promises.push(
            fetchGuardianArticles(filter).then((data) => {
              CACHE[cacheKey] = { data, timestamp: Date.now() };
              return data;
            })
          );
        }
      }
      if (sourcesToFetch.includes("NYT")) {
        const nytFilter = { ...filter, date: formatNytDate(filter.date) };
        const cacheKey = getCacheKey("nyt", nytFilter);
        cacheKeys.push(cacheKey);
        const cached = CACHE[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          promises.push(Promise.resolve(cached.data));
        } else {
          promises.push(
            fetchNytArticles(nytFilter).then((data) => {
              CACHE[cacheKey] = { data, timestamp: Date.now() };
              return data;
            })
          );
        }
      }
      const results = await Promise.all(promises);
      let articles = results.flat();
      if (preferences.categories.length > 0) {
        articles = articles.filter(
          (a) => a.category && preferences.categories.includes(a.category)
        );
      }
      if (preferences.authors.length > 0) {
        articles = articles.filter(
          (a) => a.author && preferences.authors.includes(a.author)
        );
      }
      setArticles(articles);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [filter, preferences, setArticles, setLoading, newsApiSources]);

  return { fetchAllArticles };
}
