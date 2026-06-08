"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { applyFilters } from "@/lib/filterProducts";
import { useProducts } from "@/components/filters/FiltersProvider";
import { useState } from "react";

export default function BrandFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  const products = useProducts();
  const selectedBrands = searchParams.get("brands")?.split(",").filter(Boolean) ?? [];

  const availableBrands = new Set(
    applyFilters(products, searchParams, ["brands"]).map((p) => p.brand)
  );

  // Always show selected brands even if they have no matches in current filter set
  const brandList = Array.from(
    new Set([...Array.from(availableBrands), ...selectedBrands])
  ).sort();

  function handleSelect(brand: string) {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) params.set("brands", updated.join(","));
    else params.delete("brands");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-semibold mb-2"
      >
        <span>Brand</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <ul className="space-y-1">
          {brandList.map((brand) => {
            const isSelected = selectedBrands.includes(brand);
            const isUnavailable = isSelected && !availableBrands.has(brand);
            return (
              <li key={brand}>
                <button
                  onClick={() => handleSelect(brand)}
                  className={`text-sm w-full text-left px-2 py-1 rounded ${
                    isSelected
                      ? isUnavailable
                        ? "bg-blue-300 text-white line-through opacity-70"
                        : "bg-blue-500 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {brand}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
