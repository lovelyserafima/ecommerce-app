"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { applyFilters } from "@/lib/filterProducts";
import { useProducts } from "@/components/filters/FiltersProvider";
import { useState } from "react";

interface Props {
  attribute: string;
  label: string;
}

export default function AttributeFilter({ attribute, label }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const products = useProducts();

  const available = applyFilters(products, searchParams, [attribute]);
  const values = Array.from(
    new Set(available.map(p => String(p.attributes[attribute])).filter(v => v !== "undefined"))
  );

  const selected = searchParams.get(attribute);
  const [isOpen, setIsOpen] = useState(true);

  if (!searchParams.get("category") || values.length === 0) return null;

  function handleSelect(value: string) {
    const current = searchParams.get(attribute)?.split(",").filter(Boolean) ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    
    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set(attribute, updated.join(","));
    } else {
      params.delete(attribute);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-semibold mb-2"
      >
        <span>{label}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
      <ul className="space-y-1">
        {values.map((value) => (
          <li key={value}>
            <button
              onClick={() => handleSelect(value)}
              className={`text-sm w-full text-left px-2 py-1 rounded ${
                selected?.split(",").includes(value) ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}