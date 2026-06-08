import { NextResponse } from "next/server";
import { getProducts } from "@/services/productService";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = Math.max(1, Number(searchParams.get("perPage") ?? DEFAULT_PER_PAGE));

  const { products, total } = await getProducts({
    search: searchParams.get("search"),
    category: searchParams.get("category"),
    subcategory: searchParams.get("subcategory"),
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    minRating: searchParams.get("minRating"),
    sort: searchParams.get("sort"),
    brands: searchParams.get("brands"),
    color: searchParams.get("color"),
    size: searchParams.get("size"),
    material: searchParams.get("material"),
    availability: searchParams.get("availability"),
    sku: searchParams.get("sku"),
    page,
    perPage,
  });

  return NextResponse.json({ products, total });
}
