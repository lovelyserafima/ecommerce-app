import type { IProductRepository } from "@/repositories/IProductRepository";
import { PrismaProductRepository } from "@/repositories/PrismaProductRepository";
import { MockProductRepository } from "@/repositories/MockProductRepository";
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

  const [{ products, total }, allProducts] = await Promise.all([
    repository.findMany(query),
    repository.findAll(),
  ]);

  return { products, total, allProducts };
}

export async function getProduct(id: string): Promise<Product | null> {
  return getRepository().findById(id);
}
