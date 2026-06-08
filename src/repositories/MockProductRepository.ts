import type { IProductRepository } from "@/repositories/IProductRepository";
import type { Product } from "@/types/product";
import { products } from "@/lib/products";

export class MockProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    return products;
  }
}
