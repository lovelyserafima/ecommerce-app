"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/components/filters/FiltersProvider";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useProducts();
  const selected = searchParams.get("category");

  const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort();

  function handleSelect(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selected === category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("subcategory");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Category</h3>
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => handleSelect(category)}
              className={`text-sm w-full text-left px-2 py-1 rounded ${
                selected === category ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
