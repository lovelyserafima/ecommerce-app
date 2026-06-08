"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const [suggestions, setSuggestions] = useState<{id: string, name: string}[]>([]);
  const isFirstRender = useRef(true);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/products?${params.toString()}`);

      if (value.length > 1) {
        fetch(`/api/products/search?q=${encodeURIComponent(value)}`)
          .then(r => r.json())
          .then(data => setSuggestions(data));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
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