import React from "react";
import type { Article } from "../types/article";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2">
    {article.urlToImage && (
      <img
        src={article.urlToImage}
        alt={article.title}
        className="rounded w-full h-48 object-cover mb-2"
      />
    )}
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xl font-bold text-blue-600 hover:underline"
    >
      {article.title}
    </a>
    <p className="text-gray-700 dark:text-gray-300 text-sm">
      {article.description}
    </p>
    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
      <span>{article.source}</span>
      <span>{article.publishedAt.slice(0, 10)}</span>
    </div>
    {article.author && (
      <div className="text-xs text-gray-400">By {article.author}</div>
    )}
  </div>
);

export default ArticleCard;
