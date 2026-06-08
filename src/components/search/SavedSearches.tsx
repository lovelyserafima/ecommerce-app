"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SavedSearches() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [savedSearches, setSavedSearches] = useState<{name: string, params: string}[]>([]);

  useEffect(() => {
    setSavedSearches(JSON.parse(localStorage.getItem("savedSearches") ?? "[]"));
    setMounted(true);

    const handleStorageChange = () => {
      setSavedSearches(JSON.parse(localStorage.getItem("savedSearches") ?? "[]"));
    };
    window.addEventListener("savedSearchesUpdated", handleStorageChange);
    return () => window.removeEventListener("savedSearchesUpdated", handleStorageChange);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {savedSearches.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Previous Searches</h3>
          <button
            onClick={() => { localStorage.removeItem("savedSearches"); setSavedSearches([]); }}
            className="text-sm px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 mb-2"
          >
        Clear All
      </button>
      <ul className="space-y-2">
        {savedSearches.map((save, index) => (
          <li key={index} className="text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push(`/products?${save.params}`)}>
            {save.name} <button
              onClick={(e) => {
                localStorage.setItem("savedSearches", JSON.stringify(savedSearches.filter((_, i) => i !== index)));
                window.dispatchEvent(new Event("savedSearchesUpdated"));
                e.stopPropagation();
              }}
              className="text-xs text-red-500 ml-2"
            >
              x
            </button>
          </li>
        ))}
      </ul>
      </>
      )}
    </div>
  );
}