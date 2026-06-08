import type { Product } from "@/types/product";

export type FindManyParams = {
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
  page?: number;
  perPage?: number;
};

export type FindManyResult = {
  products: Product[];
  total: number;
};

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findMany(params: FindManyParams): Promise<FindManyResult>;
  findById(id: string): Promise<Product | null>;
}
