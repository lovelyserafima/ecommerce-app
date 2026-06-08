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
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}