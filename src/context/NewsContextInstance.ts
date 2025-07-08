import React from "react";
import type { Article } from "../types/article";
import type { Filter } from "../types/filter";
import type { UserPreferences } from "../types/userPreferences";

export interface NewsContextType {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const NewsContext = React.createContext<NewsContextType | undefined>(
  undefined
);
