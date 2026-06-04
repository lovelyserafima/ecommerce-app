"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localMin, setLocalMin] = useState(Number(searchParams.get("minPrice") ?? 0));
  const [localMax, setLocalMax] = useState(Number(searchParams.get("maxPrice") ?? 5000));
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("minPrice", localMin.toString());
      params.set("maxPrice", localMax.toString());
      router.push(`/products?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [localMin, localMax]);

  return (
    <div>
      <h3 className="font-semibold mb-2">Price</h3>
      <div className="flex flex-col gap-2">
        <input type="range" min={0} max={5000} value={localMin} onChange={(e) => setLocalMin(Number(e.target.value))} />
        <input type="range" min={0} max={5000} value={localMax} onChange={(e) => setLocalMax(Number(e.target.value))} />
      </div>
      <div className="text-sm mt-2">${localMin} - ${localMax}</div>
    </div>
  );
}