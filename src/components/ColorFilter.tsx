"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { colors as colorList } from "@/lib/products";

export default function ColorFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("colors");

  function handleSelect(color: string) {
    const current = searchParams.get("colors")?.split(",").filter(Boolean) ?? [];
    const updated = current.includes(color)
      ? current.filter((c) => c !== color)
      : [...current, color];
    
    const params = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      params.set("colors", updated.join(","));
    } else {
      params.delete("colors");
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
      <div>
        <h3 className="font-semibold mb-2">Color</h3>
        <ul className="space-y-1">
          {colorList.map((color) => (
            <li key={String(color)}>
              <button
                onClick={() => handleSelect(String(color))}
                className={`text-sm w-full text-left px-2 py-1 rounded ${
                  selected?.split(",").includes(String(color)) ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {color}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
}