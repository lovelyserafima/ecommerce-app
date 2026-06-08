"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "@/components/filters/FiltersProvider";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useProducts();

  const { priceMin, priceMax } = useMemo(() => {
    if (allProducts.length === 0) return { priceMin: 0, priceMax: 5000 };
    const prices = allProducts.map((p) => p.price);
    return {
      priceMin: Math.floor(Math.min(...prices)),
      priceMax: Math.ceil(Math.max(...prices)),
    };
  }, [allProducts]);

  const [localMin, setLocalMin] = useState(() =>
    Number(searchParams.get("minPrice") ?? priceMin)
  );
  const [localMax, setLocalMax] = useState(() =>
    Number(searchParams.get("maxPrice") ?? priceMax)
  );
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
        <input type="range" min={priceMin} max={priceMax} value={localMin} onChange={(e) => setLocalMin(Number(e.target.value))} />
        <input type="range" min={priceMin} max={priceMax} value={localMax} onChange={(e) => setLocalMax(Number(e.target.value))} />
      </div>
      <div className="text-sm mt-2">${localMin} – ${localMax}</div>
    </div>
  );
}
