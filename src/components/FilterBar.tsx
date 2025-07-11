import React, { useState } from "react";
import type { Filter } from "../types/filter";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DatePicker } from "./ui/DatePicker";
import { Button } from "./ui/button";

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
  const [date, setDate] = useState<Date | undefined>(
    filter.date ? new Date(filter.date) : undefined
  );
  const [category, setCategory] = useState(filter.category || "");
  const [source, setSource] = useState(filter.source || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ keyword, date: date?.toISOString(), category, source });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end mb-4"
    >
      <Input
        type="text"
        placeholder="Search articles..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <DatePicker value={date} onChange={setDate} placeholder="Sort By Date" />

      <div className="w-full">
        <Select
          value={category || "__all__"}
          onValueChange={(val) => setCategory(val === "__all__" ? "" : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full">
        <Select
          value={source || "__all__"}
          onValueChange={(val) => setSource(val === "__all__" ? "" : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Sources</SelectItem>
            {sources.map((src) => (
              <SelectItem key={src.id} value={src.id}>
                {src.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" variant={"default"}>
        Apply
      </Button>
    </form>
  );
};

export default FilterBar;
