"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SaveSearch() {
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const saves = JSON.parse(localStorage.getItem("savedSearches") ?? "[]");
    saves.push({
      name: `Search ${new Date().toLocaleDateString()}`,
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