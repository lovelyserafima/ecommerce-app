"use client";

import { useRouter } from "next/navigation";

export default function ResetFilters() {
  const router = useRouter();

  function handleSelect() {
    router.push(`/products`);
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Reset Filters</h3>
      <button
        onClick={() => handleSelect()}
        className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}
      >
        Clear All
      </button>
    </div>
  );
}