"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localMin, setLocalMin] = useState(Number(searchParams.get("minPrice") ?? PRICE_MIN));
  const [localMax, setLocalMax] = useState(Number(searchParams.get("maxPrice") ?? PRICE_MAX));
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
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={localMin} onChange={(e) => setLocalMin(Number(e.target.value))} />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={localMax} onChange={(e) => setLocalMax(Number(e.target.value))} />
      </div>
      <div className="text-sm mt-2">${localMin} - ${localMax}</div>
    </div>
  );
}