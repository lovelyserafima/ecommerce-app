"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/components/filters/FiltersProvider";
import { applyFilters } from "@/lib/filterProducts";

export default function RatingFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useProducts();
  const selected = searchParams.get("minRating");

  const ratings = Array.from(
    new Set(
      applyFilters(allProducts, searchParams, ["minRating"])
        .map((p) => Math.floor(p.rating.average))
    )
  ).sort((a, b) => a - b);

  const options = ratings.slice(1); // skip the lowest — it's the default (show all)

  function handleSelect(rating: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selected === rating) {
      params.delete("minRating");
    } else {
      params.set("minRating", rating);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Rating</h3>
      <ul className="space-y-1">
        {options.map((rating) => (
          <li key={rating}>
            <button
              onClick={() => handleSelect(rating.toString())}
              className={`text-sm w-full text-left px-2 py-1 rounded ${
                selected === rating.toString() ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              ⭐ {rating} Stars & Up
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
