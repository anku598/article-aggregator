import React from "react";
import { NewsContext } from "./NewsContextInstance";

export function useNewsContext() {
  const context = React.useContext(NewsContext);
  if (!context)
    throw new Error("useNewsContext must be used within a NewsProvider");
  return context;
}
