"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/components/filters/FiltersProvider";
import { useState } from "react";

export default function SubcategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useProducts();
  const selectedCategory = searchParams.get("category");
  const selectedSubcategory = searchParams.get("subcategory");
  const [isOpen, setIsOpen] = useState(true);

  if (!selectedCategory) return null;

  const subcategoryList = Array.from(
    new Set(allProducts.filter((p) => p.category === selectedCategory).map((p) => p.subcategory))
  ).sort();

  function handleSelect(sub: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sub === selectedSubcategory) {
      params.delete("subcategory");
    } else {
      params.set("subcategory", sub);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-semibold mb-2"
      >
        <span>Subcategory</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <ul className="space-y-1">
          {subcategoryList.map((sub) => (
            <li key={sub}>
              <button
                onClick={() => handleSelect(sub)}
                className={`text-sm w-full text-left px-2 py-1 rounded ${
                  selectedSubcategory === sub ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {sub}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
