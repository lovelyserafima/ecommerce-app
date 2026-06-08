import Link from "next/link";
import { getProducts } from "@/services/productService";

export default async function Home() {
  const { total } = await getProducts({});

  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <span className="text-sm font-medium text-blue-500 uppercase tracking-widest mb-4">
          E-Commerce Catalog
        </span>
        <h1 className="text-5xl font-bold tracking-tight mb-6 max-w-2xl">
          Find exactly what you&apos;re looking for
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl">
          Browse {total.toLocaleString("en-US")} products across multiple categories.
          Filter by brand, price, rating and more.
        </p>
        <Link
          href="/products"
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
        >
          Browse Catalog
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800">
        {[
          { label: "Products", value: total.toLocaleString("en-US") },
          { label: "Filters", value: "Price · Brand · Rating · Size · Color" },
          { label: "Search", value: "Full-text with autocomplete" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-950 px-8 py-6 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{value}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
