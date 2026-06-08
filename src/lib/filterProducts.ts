import { products as allProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export function applyFilters(
  params: URLSearchParams,
  exclude: string[] = []
): Product[] {
  const get = (key: string) => (exclude.includes(key) ? null : params.get(key));

  return allProducts.filter((p) => {
    const search = get("search");
    if (search && !(
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )) return false;

    const category = get("category");
    if (category && p.category !== category) return false;

    const subcategory = get("subcategory");
    if (subcategory && p.subcategory !== subcategory) return false;

    const minPrice = get("minPrice");
    if (minPrice && p.price < Number(minPrice)) return false;

    const maxPrice = get("maxPrice");
    if (maxPrice && p.price > Number(maxPrice)) return false;

    const minRating = get("minRating");
    if (minRating && p.rating.average < Number(minRating)) return false;

    const brands = get("brands");
    if (brands && !brands.split(",").includes(p.brand)) return false;

    const color = get("color");
    if (color && !color.split(",").includes(String(p.attributes.color))) return false;

    const size = get("size");
    if (size && !size.split(",").includes(String(p.attributes.size))) return false;

    const material = get("material");
    if (material && !material.split(",").includes(String(p.attributes.material))) return false;

    const availability = get("availability");
    if (availability && p.availability !== availability) return false;

    return true;
  });
}
