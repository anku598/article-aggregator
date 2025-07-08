import React, { useState, useEffect } from "react";
import { useNewsContext } from "../context/useNewsContext";
import { useNewsFetcher } from "../hooks/useNews";
import ArticleCard from "../components/ArticleCard";
import FilterBar from "../components/FilterBar";
import PreferencesModal from "../components/PreferencesModal";

const allSources = ["NewsAPI", "The Guardian", "NYT"];
const allCategories = [
  "World",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
];
const allAuthors = ["Author 1", "Author 2", "Author 3"];

const Home: React.FC = () => {
  const { articles, filter, setFilter, preferences, setPreferences, loading } =
    useNewsContext();
  const [showPrefs, setShowPrefs] = useState(false);
  const { fetchAllArticles } = useNewsFetcher();

  useEffect(() => {
    fetchAllArticles();
  }, [filter, preferences, fetchAllArticles]);

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
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">News Aggregator</h1>
        <button
          onClick={() => setShowPrefs(true)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Preferences
        </button>
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
        <div className="grid gap-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center text-gray-500">No articles found.</div>
          ) : (
            filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      )}
      <PreferencesModal
        isOpen={showPrefs}
        onClose={() => setShowPrefs(false)}
        preferences={preferences}
        onSave={setPreferences}
        allSources={allSources}
        allCategories={allCategories}
        allAuthors={allAuthors}
      />
    </div>
  );
};

export default Home;
