"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const [suggestions, setSuggestions] = useState<{id: string, name: string}[]>([]);

  const handleSearch = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(value.length > 0 ? data : []);
    };

    const timer = setTimeout(() => {
      handleSearch(value);
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [value, handleSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="border rounded-lg px-4 py-2 w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg mt-1 z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => { setValue(suggestion.name); setSuggestions([]); }}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}