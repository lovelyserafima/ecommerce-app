"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  const handleSearch = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value, handleSearch]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search products..."
      className="border rounded-lg px-4 py-2 w-full"
    />
  );
}