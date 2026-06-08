"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MAX_RECENT = 5;
const FILTER_KEYS = ["category", "subcategory", "brands", "minPrice", "maxPrice", "minRating", "color", "size", "material", "availability"];

function buildLabel(searchParams: URLSearchParams): string {
  const parts: string[] = [];
  const search = searchParams.get("search");
  if (search) parts.push(`"${search}"`);
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  if (category && subcategory) parts.push(`${category} > ${subcategory}`);
  else if (category) parts.push(category);
  if (searchParams.get("brands")) parts.push(searchParams.get("brands")!);
  const min = searchParams.get("minPrice");
  const max = searchParams.get("maxPrice");
  if (min || max) parts.push(`$${min ?? 0}–$${max ?? "∞"}`);
  if (searchParams.get("minRating")) parts.push(`${searchParams.get("minRating")}★+`);
  return parts.join(" · ") || "All products";
}

export default function SavedSearches() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<{ name: string; params: string }[]>([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("recentSearches") ?? "[]");
    // Guard against old format (string[]) from previous version
    const valid = Array.isArray(raw)
      ? raw.filter((s): s is { name: string; params: string } =>
          typeof s === "object" && s !== null && typeof s.name === "string" && typeof s.params === "string"
        )
      : [];
    setRecentSearches(valid);
    setMounted(true);
  }, []);

  useEffect(() => {
    const search = searchParams.get("search") ?? "";
    const hasFilters = FILTER_KEYS.some((k) => searchParams.get(k));

    // Skip if search term is too short and no other filters
    if (search.length < 2 && !hasFilters) return;

    // Debounce so intermediate keystrokes don't get saved
    const timer = setTimeout(() => {
      const params = searchParams.toString();
      const name = buildLabel(searchParams);
      setRecentSearches((prev) => {
        const updated = [{ name, params }, ...prev.filter((s) => s.params !== params)].slice(0, MAX_RECENT);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        return updated;
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams.toString()]);

  if (!mounted || recentSearches.length === 0) return null;

  function remove(params: string) {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s.params !== params);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }

  function clearAll() {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
        {recentSearches.map((item) => (
          <li key={item.params} className="flex items-center justify-between group">
            <button
              onClick={() => router.push(`/products?${item.params}`)}
              className="text-sm text-blue-500 hover:underline truncate text-left"
            >
              {item.name}
            </button>
            <button
              onClick={() => remove(item.params)}
              className="text-xs text-gray-300 hover:text-red-400 ml-1 opacity-0 group-hover:opacity-100 shrink-0"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
