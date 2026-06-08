"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PER_PAGE, PER_PAGE_OPTIONS } from "@/lib/constants";

export default function PerPageSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage") ?? String(DEFAULT_PER_PAGE);
  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", value);
    params.set("page", "1"); // reset to first page
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>Show:</span>
      <select
        value={perPage}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {PER_PAGE_OPTIONS.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );
}