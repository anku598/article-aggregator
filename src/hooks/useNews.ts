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
          // Only call NewsAPI with the selected source
          const articles = await fetchNewsApiArticles({
            ...filter,
            source: filter.source,
          });
          setArticles(articles);
          setLoading(false);
          return;
        } else if (filter.source === "The Guardian") {
          const articles = await fetchGuardianArticles(filter);
          setArticles(articles);
          setLoading(false);
          return;
        } else if (filter.source === "NYT") {
          // Format date for NYT
          const nytFilter = { ...filter, date: formatNytDate(filter.date) };
          const articles = await fetchNytArticles(nytFilter);
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
      if (sourcesToFetch.includes("NewsAPI"))
        promises.push(fetchNewsApiArticles(filter));
      if (sourcesToFetch.includes("The Guardian"))
        promises.push(fetchGuardianArticles(filter));
      if (sourcesToFetch.includes("NYT")) {
        const nytFilter = { ...filter, date: formatNytDate(filter.date) };
        promises.push(fetchNytArticles(nytFilter));
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
