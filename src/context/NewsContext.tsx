import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { NewsContext } from "./NewsContextInstance";
import type { Article } from "../types/article";
import type { Filter } from "../types/filter";
import type { UserPreferences } from "../types/userPreferences";
import {
  fetchNewsApiSources,
  getNewsApiCategories,
} from "../services/newsApiService";
import { fetchGuardianSections } from "../services/guardianService";
import { getNytCategories } from "../services/nytService";

const defaultFilter: Filter = { keyword: "" };
const defaultPreferences: UserPreferences = {
  sources: [],
  categories: [],
  authors: [],
};

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);

  // Dynamic sources and categories
  const [newsApiSources, setNewsApiSources] = useState<
    { id: string; name: string; category: string }[]
  >([]);
  const [newsApiCategories, setNewsApiCategories] = useState<string[]>(
    getNewsApiCategories()
  );
  const [guardianSections, setGuardianSections] = useState<
    { id: string; webTitle: string }[]
  >([]);
  const [nytCategories, setNytCategories] = useState<string[]>(
    getNytCategories()
  );

  useEffect(() => {
    fetchNewsApiSources().then(setNewsApiSources);
    fetchGuardianSections().then(setGuardianSections);
    setNewsApiCategories(getNewsApiCategories());
    setNytCategories(getNytCategories());
  }, []);

  return (
    <NewsContext.Provider
      value={{
        articles,
        setArticles,
        filter,
        setFilter,
        preferences,
        setPreferences,
        loading,
        setLoading,
        newsApiSources,
        setNewsApiSources,
        newsApiCategories,
        setNewsApiCategories,
        guardianSections,
        setGuardianSections,
        nytCategories,
        setNytCategories,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
