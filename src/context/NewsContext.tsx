import React from "react";
import type { ReactNode } from "react";
import type { Article } from "../types/article";
import type { Filter } from "../types/filter";
import type { UserPreferences } from "../types/userPreferences";
import { NewsContext } from "./NewsContextInstance";

const defaultFilter: Filter = { keyword: "" };
const defaultPreferences: UserPreferences = {
  sources: [],
  categories: [],
  authors: [],
};

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [filter, setFilter] = React.useState<Filter>(defaultFilter);
  const [preferences, setPreferences] =
    React.useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = React.useState(false);

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
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
