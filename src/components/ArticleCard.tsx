import React from "react";
import type { Article } from "../types/article";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => (
  <div className="rounded overflow-hidden shadow-lg flex flex-col">
    {article.urlToImage && (
      <img
        src={article.urlToImage}
        alt={article.title}
        className="rounded w-full mb-2 max-h-[200px] object-cover"
      />
    )}
    <div className="p-4">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xl font-bold hover:underline"
      >
        <h2 className="text-[#222] font-bold mb-3">{article.title}</h2>

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
      </a>
    </div>
  </div>
);

export default ArticleCard;
