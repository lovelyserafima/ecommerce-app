"use client";

import { Product } from "@/types/product";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl">✕</button>
        <div className="flex flex-col md:flex-row gap-6">
          <img src={product.images[0]} alt={product.name} className="w-full md:w-1/2 h-auto object-cover rounded" />
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.price}</span>
              <span className={`px-2 py-1 text-xs rounded ${product.availability === "in_stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {product.availability === "in_stock" ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => alert("Added to cart!")}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}