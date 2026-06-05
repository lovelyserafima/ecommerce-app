"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

interface Props {
  initialProducts: Product[];
  total: number;
  filterParams: Record<string, string>;
  perPage: number;
}

export default function ProductGrid({ initialProducts, total, filterParams, perPage }: Props) {
  const [productList, setProductList] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = productList.length < total;

  useEffect(() => {
    function handleScroll() {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1500;
      if (nearBottom && !loadingRef.current && hasMore) {
        loadMore();
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, page]);

  async function loadMore() {
    loadingRef.current = true;
    setLoading(true);
    const nextPage = page + 1;
    const params = new URLSearchParams({
      ...filterParams,
      page: String(nextPage),
      perPage: String(perPage),
    });
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProductList((prev) => [...prev, ...data.products]);
    setPage(nextPage);
    loadingRef.current = false;
    setLoading(false);
  }

  if (productList.length === 0) {
    return <p className="text-gray-500">No products found. Try adjusting your filters.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-8" />
      {loading && <p className="text-center text-gray-500 py-4">Loading...</p>}
      {!hasMore && productList.length > perPage && (
        <p className="text-center text-gray-400 py-4 text-sm">All products loaded</p>
      )}
    </>
  );
}
