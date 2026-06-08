import type { IProductRepository } from "@/repositories/IProductRepository";
import type { Product } from "@/types/product";
import type { Availability } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

function dbRowToProduct(row: {
  id: string; name: string; brand: string; category: string; subcategory: string;
  description: string; price: number; originalPrice: number | null; images: string[];
  sku: string; slug: string; ratingAverage: number; ratingCount: number;
  availability: Availability; attributes: unknown; createdAt: Date;
}): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
    description: row.description,
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    images: row.images,
    sku: row.sku,
    availability: row.availability,
    rating: { average: row.ratingAverage, count: row.ratingCount },
    attributes: row.attributes as Product["attributes"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.createdAt.toISOString(),
  };
}

export class PrismaProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(dbRowToProduct);
  }
}
