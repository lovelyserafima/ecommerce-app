import { getProductBySlug, products } from "@/lib/products";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductBySlug(id) || products.find((p) => p.id === id);
  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductBySlug(id) || products.find((p) => p.id === id);
    if (!product) {
        return (
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                <p className="text-gray-500">The product you are looking for does not exist.</p>
            </main>
        );
    }
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
          {product.availability === "out_of_stock" ? (
            <span className="text-red-500 font-medium">Out of stock</span>
          ) : (
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </main>
  );
}