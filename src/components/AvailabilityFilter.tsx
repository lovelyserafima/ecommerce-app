"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { applyFilters } from "@/lib/filterProducts";

export default function AvailabilityFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("availability");

  const available = applyFilters(searchParams, ["availability"]);
  const availableValues = new Set(available.map(p => p.availability));

  const availabilities = [
    { value: "in_stock", label: "In Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "pre_order", label: "Pre-order" },
  ].filter(({ value }) => availableValues.has(value));

  function handleSelect(availability: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selected === availability) {
      params.delete("availability");
    } else {
      params.set("availability", availability);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Availability</h3>
      <ul className="space-y-1">
        {availabilities.map(({ value, label }) => (
          <li key={value}>
            <button
              onClick={() => handleSelect(value)}
              className={`text-sm w-full text-left px-2 py-1 rounded ${
                selected === value ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}