import type { Product } from "@/types/product";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
}
