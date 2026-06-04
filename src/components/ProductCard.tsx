"use client";

import { Product } from "@/types/product";
import Link from "next/link";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <div className="border rounded-lg p-4 group relative">
      <div className="w-full h-[192px] overflow-hidden rounded-t-lg relative">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        <button
          onClick={() => setIsQuickViewOpen(true)}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
        >
          Quick View
        </button>
      </div>
      <Link href={`/products/${product.id}`}>
        <h2 className="text-xl font-bold mt-2 hover:underline">{product.name}</h2>
      </Link>
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