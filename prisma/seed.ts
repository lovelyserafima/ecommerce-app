import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { products, toSlug } from "../src/lib/products";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.product.deleteMany();

  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subcategory: p.subcategory,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        images: p.images,
        sku: p.sku,
        slug: toSlug(p.name),
        ratingAverage: p.rating.average,
        ratingCount: p.rating.count,
        availability: p.availability,
        attributes: p.attributes,
        createdAt: new Date(p.createdAt),
      },
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
