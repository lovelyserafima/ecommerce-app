import type { Product } from "@/types/product";

export function applyFilters(
  items: Product[],
  params: URLSearchParams,
  exclude: string[] = []
): Product[] {
  const get = (key: string) => (exclude.includes(key) ? null : params.get(key));

  return items.filter((p) => {
    const search = get("search");
    if (search && !(
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase() === search.toLowerCase()
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

export function applySort(
  items: Product[],
  sort: string | null,
  search?: string | null
): Product[] {
  const sorted = [...items];

  if (sort === "price_asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sort === "rating_desc") {
    sorted.sort((a, b) => b.rating.average - a.rating.average);
  } else if (sort === "newest") {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === "popularity") {
    sorted.sort((a, b) => b.rating.count - a.rating.count);
  } else if (sort === "relevance" && search) {
    const q = search.toLowerCase();
    const score = (p: Product) => {
      if (p.name.toLowerCase() === q) return 3;
      if (p.name.toLowerCase().includes(q)) return 2;
      if (p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) return 1;
      return 0;
    };
    sorted.sort((a, b) => score(b) - score(a));
  }

  return sorted;
}
