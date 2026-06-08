import { MockProductRepository } from "@/repositories/MockProductRepository";

describe("MockProductRepository", () => {
  const repository = new MockProductRepository();

  it("returns an array of products", async () => {
    const products = await repository.findAll();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("each product has required fields", async () => {
    const products = await repository.findAll();
    for (const product of products) {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("brand");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("availability");
      expect(product).toHaveProperty("rating");
    }
  });

  it("product prices are positive numbers", async () => {
    const products = await repository.findAll();
    expect(products.every((p) => p.price > 0)).toBe(true);
  });
});
