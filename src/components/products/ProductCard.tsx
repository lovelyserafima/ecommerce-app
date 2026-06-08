"use client";

import { Product } from "@/types/product";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <div className="border rounded-lg p-4 group relative cursor-pointer" onClick={() => router.push(`/products/${product.slug ?? product.id}`)}>
      <div className="w-full h-[192px] overflow-hidden rounded-t-lg relative">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsQuickViewOpen(true);
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
        >
          Quick View
        </button>
      </div>
      <h2 className="text-xl font-bold mt-2 hover:underline">{product.name}</h2>
      <p className="text-gray-600">{product.brand}</p>
      {product.originalPrice && (
        <p className="text-gray-500 line-through">${product.originalPrice}</p>
      )}
      <p className="text-gray-800 font-semibold">${product.price}</p>
      <p className="text-yellow-500 text-sm">
        ⭐ {product.rating.average} ({product.rating.count.toLocaleString("en-US")} reviews)
      </p>
      {product.availability === "out_of_stock" && (
        <span className="text-red-500 text-sm font-medium">Out of stock</span>
      )}
      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </div>
  );
}
