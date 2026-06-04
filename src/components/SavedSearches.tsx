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
      <h3 className="font-semibold mb-2">Saved Searches</h3>
      <ul className="space-y-2">
        {savedSearches.map((save, index) => (
          <li key={index} className="text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push(`/products?${save.params}`)}>
            {save.name}
          </li>
        ))}
      </ul>
    </div>
  );
}