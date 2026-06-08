import { getProducts } from "@/services/productService";

// next/jest loads .env automatically; clear DB URL so tests use MockProductRepository
beforeAll(() => { delete process.env.DATABASE_URL; });
describe("productService", () => {
  it("returns products and total", async () => {
    const result = await getProducts({});
    expect(Array.isArray(result.products)).toBe(true);
    expect(typeof result.total).toBe("number");
    expect(result.total).toBeGreaterThan(0);
  });

  it("returns allProducts unaffected by pagination", async () => {
    const result = await getProducts({ page: 1, perPage: 2 });
    expect(result.products.length).toBeLessThanOrEqual(2);
    expect(result.allProducts.length).toBeGreaterThan(result.products.length);
  });

  it("filters by category via query", async () => {
    const result = await getProducts({ category: "Footwear" });
    expect(result.products.every((p) => p.category === "Footwear")).toBe(true);
  });

  it("total reflects filtered count not page count", async () => {
    const result = await getProducts({ page: 1, perPage: 2 });
    expect(result.total).toBeGreaterThan(result.products.length);
  });

  it("returns empty products for non-existent category", async () => {
    const result = await getProducts({ category: "NonExistentCategory" });
    expect(result.products).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
