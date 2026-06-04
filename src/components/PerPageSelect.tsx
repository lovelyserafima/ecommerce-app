"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PerPageSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage") ?? "24";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("perPage", value);
    params.set("page", "1"); // сбрасываем на первую страницу
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
        {[24, 48, 72].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );
}