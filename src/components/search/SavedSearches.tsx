"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MAX_RECENT = 5;

export default function SavedSearches() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(JSON.parse(localStorage.getItem("recentSearches") ?? "[]"));
    setMounted(true);
  }, []);

  // Auto-save when user performs a search
  useEffect(() => {
    const term = searchParams.get("search")?.trim();
    if (!term) return;

    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, MAX_RECENT);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, [searchParams.get("search")]);

  if (!mounted || recentSearches.length === 0) return null;

  function remove(term: string) {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }

  function clearAll() {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Recent Searches</h3>
        <button
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          Clear
        </button>
      </div>
      <ul className="space-y-1">
        {recentSearches.map((term) => (
          <li key={term} className="flex items-center justify-between group">
            <button
              onClick={() => router.push(`/products?search=${encodeURIComponent(term)}`)}
              className="text-sm text-blue-500 hover:underline truncate"
            >
              {term}
            </button>
            <button
              onClick={() => remove(term)}
              className="text-xs text-gray-300 hover:text-red-400 ml-1 opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
