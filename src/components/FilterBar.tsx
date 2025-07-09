import React, { useState } from "react";
import type { Filter } from "../types/filter";

interface SourceOption {
  id: string;
  name: string;
}

interface FilterBarProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
  sources: SourceOption[];
  categories: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChange,
  sources,
  categories,
}) => {
  const [keyword, setKeyword] = useState(filter.keyword);
  const [date, setDate] = useState(filter.date || "");
  const [category, setCategory] = useState(filter.category || "");
  const [source, setSource] = useState(filter.source || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ keyword, date, category, source });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-2 items-end mb-4"
    >
      <input
        type="text"
        placeholder="Search articles..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border rounded px-2 py-1 flex-1 min-w-[150px]"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Sources</option>
        {sources.map((src) => (
          <option key={src.id} value={src.id}>
            {src.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Apply
      </button>
    </form>
  );
};

export default FilterBar;
