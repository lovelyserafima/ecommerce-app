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
  const [isOpen, setIsOpen] = useState(true);

  const selectedValues = searchParams.get(attribute)?.split(",").filter(Boolean) ?? [];

  const availableValues = new Set(
    applyFilters(products, searchParams, [attribute])
      .map((p) => String(p.attributes[attribute]))
      .filter((v) => v !== "undefined")
  );

  // Always show selected values even if they have no matches in current filter set
  const valueList = Array.from(
    new Set([...Array.from(availableValues), ...selectedValues])
  ).sort();

  if (!searchParams.get("category") || valueList.length === 0) return null;

  function handleSelect(value: string) {
    const updated = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) params.set(attribute, updated.join(","));
    else params.delete(attribute);
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
          {valueList.map((value) => {
            const isSelected = selectedValues.includes(value);
            const isUnavailable = isSelected && !availableValues.has(value);
            return (
              <li key={value}>
                <button
                  onClick={() => handleSelect(value)}
                  className={`text-sm w-full text-left px-2 py-1 rounded ${
                    isSelected
                      ? isUnavailable
                        ? "bg-blue-300 text-white line-through opacity-70"
                        : "bg-blue-500 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {value}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
