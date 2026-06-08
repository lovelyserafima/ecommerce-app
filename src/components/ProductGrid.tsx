"use client";

import { useState } from "react";
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

  const hasMore = productList.length < total;

  async function loadMore() {
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
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
      {!hasMore && productList.length > perPage && (
        <p className="text-center text-gray-400 py-4 text-sm">All products loaded</p>
      )}
    </>
  );
}
