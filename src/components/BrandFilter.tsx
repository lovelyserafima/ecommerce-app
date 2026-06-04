"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { brands as brandList } from "@/lib/products";
import { useState } from "react";

export default function BrandFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("brands");
  const [isOpen, setIsOpen] = useState(true);

  function handleSelect(brand: string) {
    const current = searchParams.get("brands")?.split(",").filter(Boolean) ?? [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    
    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set("brands", updated.join(","));
    } else {
      params.delete("brands");
    }
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
        {brandList.map((brand) => (
          <li key={brand}>
            <button
              onClick={() => handleSelect(brand)}
              className={`text-sm w-full text-left px-2 py-1 rounded ${
                selected?.split(",").includes(brand) ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {brand}
            </button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}