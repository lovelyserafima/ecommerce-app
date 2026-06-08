"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useProducts } from "@/components/filters/FiltersProvider";
import { applyFilters } from "@/lib/filterProducts";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useProducts();

  // Price range derived from products matching all active filters except price itself
  const { priceMin, priceMax } = useMemo(() => {
    const filtered = applyFilters(allProducts, searchParams, ["minPrice", "maxPrice"]);
    if (filtered.length === 0) return { priceMin: 0, priceMax: 5000 };
    const prices = filtered.map((p) => p.price);
    return {
      priceMin: Math.floor(Math.min(...prices)),
      priceMax: Math.ceil(Math.max(...prices)),
    };
  }, [allProducts, searchParams]);

  const urlMin = searchParams.get("minPrice");
  const urlMax = searchParams.get("maxPrice");

  const [localMin, setLocalMin] = useState(() =>
    urlMin !== null ? Number(urlMin) : priceMin
  );
  const [localMax, setLocalMax] = useState(() =>
    urlMax !== null ? Number(urlMax) : priceMax
  );

  // Sync sliders when URL changes externally (Clear All, other filters changing range)
  useEffect(() => {
    const newMin = urlMin !== null ? Number(urlMin) : priceMin;
    const newMax = urlMax !== null ? Number(urlMax) : priceMax;
    setLocalMin(Math.max(priceMin, Math.min(priceMax, newMin)));
    setLocalMax(Math.max(priceMin, Math.min(priceMax, newMax)));
  }, [urlMin, urlMax, priceMin, priceMax]);

  // Push to URL when user drags slider; skip if values are at the boundaries (= no filter)
  useEffect(() => {
    const prevMin = searchParams.get("minPrice");
    const prevMax = searchParams.get("maxPrice");
    const newMin = localMin > priceMin ? localMin.toString() : null;
    const newMax = localMax < priceMax ? localMax.toString() : null;
    if (prevMin === newMin && prevMax === newMax) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newMin) params.set("minPrice", newMin);
      else params.delete("minPrice");
      if (newMax) params.set("maxPrice", newMax);
      else params.delete("maxPrice");
      router.push(`/products?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [localMin, localMax]);

  return (
    <div>
      <h3 className="font-semibold mb-2">Price</h3>
      {priceMin === priceMax ? (
        <div className="text-sm text-gray-500">${priceMin}</div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <input type="range" min={priceMin} max={priceMax} value={localMin} onChange={(e) => setLocalMin(Number(e.target.value))} />
            <input type="range" min={priceMin} max={priceMax} value={localMax} onChange={(e) => setLocalMax(Number(e.target.value))} />
          </div>
          <div className="text-sm mt-2">${localMin} – ${localMax}</div>
        </>
      )}
    </div>
  );
}
