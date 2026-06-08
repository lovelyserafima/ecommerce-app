import type { IProductRepository, FindManyParams, FindManyResult } from "@/repositories/IProductRepository";
import type { Product } from "@/types/product";
import { products } from "@/lib/products";
import { applyFilters, applySort } from "@/lib/filterProducts";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export class MockProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    return products;
  }

  async findMany(params: FindManyParams): Promise<FindManyResult> {
    const urlParams = new URLSearchParams(
      Object.entries(params)
        .filter(([k, v]) => v !== undefined && v !== null && k !== "page" && k !== "perPage")
        .map(([k, v]) => [k, String(v)])
    );
    const filtered = applySort(applyFilters(products, urlParams), params.sort ?? null, params.search);
    const page = params.page ?? 1;
    const perPage = params.perPage ?? DEFAULT_PER_PAGE;
    return {
      products: filtered.slice((page - 1) * perPage, page * perPage),
      total: filtered.length,
    };
  }

  async findById(id: string): Promise<Product | null> {
    return products.find((p) => p.id === id || p.slug === id) ?? null;
  }
}
