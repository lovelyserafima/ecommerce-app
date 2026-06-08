import { getProduct } from "@/services/productService";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0], width: 800, height: 600, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={product.images[0]} alt={product.name} className="w-full md:w-1/2 rounded-lg" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-gray-900 font-bold text-xl mb-4">${product.price.toFixed(2)}</p>
          <p className="text-yellow-500 text-sm mb-4">
            ⭐ {product.rating.average} ({product.rating.count.toLocaleString()} reviews)
          </p>
          {product.availability === "in_stock" && (
            <span className="text-green-500 font-medium">In stock</span>
          )}
          {product.availability === "pre_order" && (
            <span className="text-yellow-500 font-medium">Pre-order</span>
          )}
          {product.availability === "out_of_stock" && (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </main>
  );
}
