"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SaveSearch() {
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const saves = JSON.parse(localStorage.getItem("savedSearches") ?? "[]");
    const parts: string[] = [];
    if (searchParams.get("search")) parts.push(`"${searchParams.get("search")}"`);
    if (searchParams.get("category")) parts.push(searchParams.get("category")!);
    if (searchParams.get("brands")) parts.push(searchParams.get("brands")!);
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    if (min || max) parts.push(`$${min ?? 0}–$${max ?? 5000}`);
    if (searchParams.get("minRating")) parts.push(`${searchParams.get("minRating")}★+`);

    saves.push({
      name: parts.length > 0 ? parts.join(" | ") : "All products",
      params: searchParams.toString(),
    });
    localStorage.setItem("savedSearches", JSON.stringify(saves));
    window.dispatchEvent(new Event("savedSearchesUpdated"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <button
      onClick={handleSave}
      className="text-sm px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {saved ? "Saved!" : "Save Search"}
    </button>
  );
}