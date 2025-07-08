import React, { useState } from "react";
import type { UserPreferences } from "../types/userPreferences";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
  allSources: string[];
  allCategories: string[];
  allAuthors: string[];
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
  allSources,
  allCategories,
  allAuthors,
}) => {
  const [sources, setSources] = useState<string[]>(preferences.sources);
  const [categories, setCategories] = useState<string[]>(
    preferences.categories
  );
  const [authors, setAuthors] = useState<string[]>(preferences.authors);

  const handleSave = () => {
    onSave({ sources, categories, authors });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Customize Your News Feed</h2>
        <div className="mb-2">
          <label className="block font-semibold mb-1">Sources</label>
          <select
            multiple
            value={sources}
            onChange={(e) =>
              setSources(Array.from(e.target.selectedOptions, (o) => o.value))
            }
            className="w-full border rounded px-2 py-1 h-24"
          >
            {allSources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-semibold mb-1">Categories</label>
          <select
            multiple
            value={categories}
            onChange={(e) =>
              setCategories(
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded px-2 py-1 h-24"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Authors</label>
          <select
            multiple
            value={authors}
            onChange={(e) =>
              setAuthors(Array.from(e.target.selectedOptions, (o) => o.value))
            }
            className="w-full border rounded px-2 py-1 h-24"
          >
            {allAuthors.map((auth) => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 rounded border">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
