import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  let filtered = products;

  // 1. Фильтр по поиску (name или brand содержит search)
  if (search) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 2. Фильтр по категории
  if (category) {
    filtered = filtered.filter((product) => product.category === category);
  }

  // 3. Фильтр по цене
  if (minPrice) {
    filtered = filtered.filter((product) => product.price >= Number(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter((product) => product.price <= Number(maxPrice));
  }

  return NextResponse.json(filtered);
}