"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useProducts } from "@/components/filters/FiltersProvider";
import { applyFilters } from "@/lib/filterProducts";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useProducts();

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

  useEffect(() => {
    const newMin = urlMin !== null ? Number(urlMin) : priceMin;
    const newMax = urlMax !== null ? Number(urlMax) : priceMax;
    setLocalMin(Math.max(priceMin, Math.min(priceMax, newMin)));
    setLocalMax(Math.max(priceMin, Math.min(priceMax, newMax)));
  }, [urlMin, urlMax, priceMin, priceMax]);

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
      <h3 className="font-semibold mb-3">Price</h3>
      {priceMin === priceMax ? (
        <div className="text-sm text-gray-500">${priceMin}</div>
      ) : (
        <>
          <Slider.Root
            className="relative flex items-center w-full h-5 select-none touch-none"
            min={priceMin}
            max={priceMax}
            step={1}
            value={[localMin, localMax]}
            onValueChange={([min, max]) => {
              setLocalMin(min);
              setLocalMax(max);
            }}
          >
            <Slider.Track className="relative bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 flex-1">
              <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </Slider.Root>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>${priceMin}</span>
            <span>${priceMax}</span>
          </div>
          <div className="text-sm mt-1 text-center">${localMin} – ${localMax}</div>
        </>
      )}
    </div>
  );
}
