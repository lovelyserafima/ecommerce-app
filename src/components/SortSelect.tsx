"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { sortOptions } from "@/lib/products";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("sort");

  function handleSelect(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selected === sort) {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Sort By</h3>
      <select
        value={selected || ""}
        onChange={(e) => handleSelect(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full"
      >
        <option value="">Default</option>
        {sortOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={`text-sm w-full text-left px-2 py-1 rounded ${
              selected === option.value ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}