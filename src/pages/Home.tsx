import React, { useState, useEffect } from "react";
import { useNewsContext } from "../context/useNewsContext";
import { useNewsFetcher } from "../hooks/useNews";
import ArticleCard from "../components/ArticleCard";
import FilterBar from "../components/FilterBar";
import PreferencesModal from "../components/PreferencesModal";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const {
    articles,
    filter,
    setFilter,
    preferences,
    setPreferences,
    loading,
    newsApiSources,
    newsApiCategories,
    guardianSections,
    nytCategories,
  } = useNewsContext();
  const [showPrefs, setShowPrefs] = useState(false);
  const { fetchAllArticles } = useNewsFetcher();

  useEffect(() => {
    fetchAllArticles();
  }, [filter, preferences, fetchAllArticles]);

  // Combine all sources for dropdown
  const allSources = [
    ...newsApiSources.map((s) => ({ id: s.id, name: s.name })),
    { id: "The Guardian", name: "The Guardian" },
    { id: "NYT", name: "NYT" },
  ];
  // Combine all categories for dropdown
  const allCategories = Array.from(
    new Set([
      ...newsApiCategories,
      ...guardianSections.map((s) => s.id),
      ...nytCategories,
    ])
  );
  const allAuthors = ["Author 1", "Author 2", "Author 3"];

  // Filter articles based on preferences (for demo, real filter should be in fetch logic)
  const filteredArticles = articles.filter((article) => {
    const matchSource =
      preferences.sources.length === 0 ||
      preferences.sources.includes(article.source);
    const matchCategory =
      preferences.categories.length === 0 ||
      !article.category ||
      preferences.categories.includes(article.category);
    const matchAuthor =
      preferences.authors.length === 0 ||
      (article.author && preferences.authors.includes(article.author));
    return matchSource && matchCategory && matchAuthor;
  });

  return (
    <div className="max-w-[95%] mx-auto p-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Article Aggregator</h1>
        <Button variant={"default"} onClick={() => setShowPrefs(true)}>
          Preferences
        </Button>
      </div>
      <FilterBar
        filter={filter}
        onChange={setFilter}
        sources={allSources}
        categories={allCategories}
      />
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="py-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center text-gray-500">No articles found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
      <PreferencesModal
        isOpen={showPrefs}
        onClose={() => setShowPrefs(false)}
        preferences={preferences}
        onSave={setPreferences}
        allSources={allSources.map((s) => s.name)}
        allCategories={allCategories}
        allAuthors={allAuthors}
      />
    </div>
  );
};

export default Home;
