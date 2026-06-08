import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get("q");


  let filtered = products;

  // Filter by name or brand containing the search query
  if (search) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
    );
  }

  filtered = filtered.slice(0, 5);

  return NextResponse.json(filtered.map(({ id, name }) => ({ id, name })));
}