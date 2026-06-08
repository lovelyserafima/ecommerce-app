import type { IProductRepository } from "@/repositories/IProductRepository";
import { PrismaProductRepository } from "@/repositories/PrismaProductRepository";
import { MockProductRepository } from "@/repositories/MockProductRepository";
import { applyFilters, applySort } from "@/lib/filterProducts";
import type { Product } from "@/types/product";

function getRepository(): IProductRepository {
  if (process.env.DATABASE_URL) {
    return new PrismaProductRepository();
  }
  return new MockProductRepository();
}

export type ProductQuery = {
  search?: string | null;
  category?: string | null;
  subcategory?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  minRating?: string | null;
  sort?: string | null;
  brands?: string | null;
  color?: string | null;
  size?: string | null;
  material?: string | null;
  availability?: string | null;
  sku?: string | null;
  page?: number;
  perPage?: number;
};

export type ProductsResult = {
  products: Product[];
  total: number;
  allProducts: Product[];
};

export async function getProducts(query: ProductQuery): Promise<ProductsResult> {
  const repository = getRepository();
  const allProducts = await repository.findAll();

  const urlParams = new URLSearchParams(
    Object.entries(query)
      .filter(([k, v]) => v !== undefined && v !== null && k !== "page" && k !== "perPage")
      .map(([k, v]) => [k, String(v)])
  );

  const filtered = applySort(applyFilters(allProducts, urlParams), query.sort ?? null, query.search);

  const page = query.page ?? 1;
  const perPage = query.perPage ?? 24;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return { products: paginated, total: filtered.length, allProducts };
}
