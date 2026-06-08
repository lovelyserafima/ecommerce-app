import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  const products = await getAllProducts();

  // Filter by name or brand containing the search query
  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return NextResponse.json(
    filtered.slice(0, 5).map(({ id, name }) => ({ id, name }))
  );
}
