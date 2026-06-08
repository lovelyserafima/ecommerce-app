import type { IProductRepository, FindManyParams, FindManyResult } from "@/repositories/IProductRepository";
import type { Product } from "@/types/product";
import type { Availability } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { applySort } from "@/lib/filterProducts";

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
    slug: row.slug,
    availability: row.availability,
    rating: { average: row.ratingAverage, count: row.ratingCount },
    attributes: row.attributes as Product["attributes"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.createdAt.toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWhere(params: FindManyParams): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AND: any[] = [];

  if (params.search) {
    const s = params.search;
    AND.push({
      OR: [
        { name: { contains: s, mode: "insensitive" } },
        { brand: { contains: s, mode: "insensitive" } },
        { description: { contains: s, mode: "insensitive" } },
        { sku: { equals: s, mode: "insensitive" } },
      ],
    });
  }

  if (params.category) AND.push({ category: params.category });
  if (params.subcategory) AND.push({ subcategory: params.subcategory });

  if (params.minPrice || params.maxPrice) {
    AND.push({
      price: {
        ...(params.minPrice ? { gte: Number(params.minPrice) } : {}),
        ...(params.maxPrice ? { lte: Number(params.maxPrice) } : {}),
      },
    });
  }

  if (params.minRating) {
    AND.push({ ratingAverage: { gte: Number(params.minRating) } });
  }

  if (params.brands) {
    AND.push({ brand: { in: params.brands.split(",") } });
  }

  if (params.color) {
    const colors = params.color.split(",");
    AND.push({ OR: colors.map((c) => ({ attributes: { path: ["color"], equals: c } })) });
  }

  if (params.size) {
    const sizes = params.size.split(",");
    AND.push({ OR: sizes.map((s) => ({ attributes: { path: ["size"], equals: s } })) });
  }

  if (params.material) {
    const materials = params.material.split(",");
    AND.push({ OR: materials.map((m) => ({ attributes: { path: ["material"], equals: m } })) });
  }

  if (params.availability) {
    AND.push({ availability: params.availability as Availability });
  }

  return AND.length > 0 ? { AND } : {};
}

function buildOrderBy(sort?: string | null) {
  switch (sort) {
    case "price_asc": return { price: "asc" as const };
    case "price_desc": return { price: "desc" as const };
    case "rating_desc": return { ratingAverage: "desc" as const };
    case "newest": return { createdAt: "desc" as const };
    case "popularity": return { ratingCount: "desc" as const };
    default: return { createdAt: "desc" as const };
  }
}

export class PrismaProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(dbRowToProduct);
  }

  async findMany(params: FindManyParams): Promise<FindManyResult> {
    const where = buildWhere(params);
    const page = params.page ?? 1;
    const perPage = params.perPage ?? DEFAULT_PER_PAGE;

    // Relevance sort requires in-memory scoring — fetch all matches first
    if (params.sort === "relevance" && params.search) {
      const rows = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
      const all = rows.map(dbRowToProduct);
      const sorted = applySort(all, "relevance", params.search);
      return {
        products: sorted.slice((page - 1) * perPage, page * perPage),
        total: sorted.length,
      };
    }

    const [rows, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy: buildOrderBy(params.sort),
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      prisma.product.count({ where }),
    ]);

    return { products: rows.map(dbRowToProduct), total };
  }

  async findById(id: string): Promise<Product | null> {
    const row = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    return row ? dbRowToProduct(row) : null;
  }
}
