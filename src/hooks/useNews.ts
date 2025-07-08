import { useCallback } from "react";
import { useNewsContext } from "../context/useNewsContext";
import { fetchNewsApiArticles } from "../services/newsApiService";
import { fetchGuardianArticles } from "../services/guardianService";
import { fetchNytArticles } from "../services/nytService";

export function useNewsFetcher() {
  const { filter, preferences, setArticles, setLoading } = useNewsContext();

  const fetchAllArticles = useCallback(async () => {
    setLoading(true);
    try {
      // Only fetch from preferred sources if set, otherwise all
      const sources =
        preferences.sources.length > 0
          ? preferences.sources
          : ["NewsAPI", "The Guardian", "NYT"];
      const promises = [];
      if (sources.includes("NewsAPI"))
        promises.push(fetchNewsApiArticles(filter));
      if (sources.includes("The Guardian"))
        promises.push(fetchGuardianArticles(filter));
      if (sources.includes("NYT")) promises.push(fetchNytArticles(filter));
      const results = await Promise.all(promises);
      // Flatten and filter by category/author if needed
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
  }, [filter, preferences, setArticles, setLoading]);

  return { fetchAllArticles };
}
