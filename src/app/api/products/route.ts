import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const brands = searchParams.get("brands");
  const color = searchParams.get("color");
  const size = searchParams.get("size");
  const material = searchParams.get("material");
  const availability = searchParams.get("availability");
  const sort = searchParams.get("sort");
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 24);

  let filtered = products.filter((p) => {
    if (search && !(
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase() === search.toLowerCase()
    )) return false;
    if (category && p.category !== category) return false;
    if (subcategory && p.subcategory !== subcategory) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minRating && p.rating.average < Number(minRating)) return false;
    if (brands && !brands.split(",").includes(p.brand)) return false;
    if (color && !color.split(",").includes(String(p.attributes.color))) return false;
    if (size && !size.split(",").includes(String(p.attributes.size))) return false;
    if (material && !material.split(",").includes(String(p.attributes.material))) return false;
    if (availability && p.availability !== availability) return false;
    return true;
  });

  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "rating_desc") filtered.sort((a, b) => b.rating.average - a.rating.average);
  else if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else if (sort === "popularity") filtered.sort((a, b) => b.rating.count - a.rating.count);

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return NextResponse.json({ products: paginated, total });
}
