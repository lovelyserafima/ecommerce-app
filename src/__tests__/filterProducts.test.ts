import { applyFilters, applySort } from "@/lib/filterProducts";
import type { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Nike Air Max",
    description: "Great sneakers",
    price: 120,
    images: [],
    brand: "Nike",
    category: "Footwear",
    subcategory: "Sneakers",
    sku: "NK-001",
    availability: "in_stock",
    rating: { average: 4.5, count: 100 },
    attributes: { color: "white", size: "42", material: "mesh" },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Adidas Ultraboost",
    description: "Running shoes",
    price: 200,
    images: [],
    brand: "Adidas",
    category: "Footwear",
    subcategory: "Running",
    sku: "AD-001",
    availability: "out_of_stock",
    rating: { average: 4.8, count: 50 },
    attributes: { color: "black", size: "43", material: "primeknit" },
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    name: "MacBook Pro",
    description: "Powerful laptop",
    price: 1999,
    images: [],
    brand: "Apple",
    category: "Electronics",
    subcategory: "Laptops",
    sku: "APL-001",
    availability: "in_stock",
    rating: { average: 4.9, count: 500 },
    attributes: { color: "silver", size: "14inch", material: "aluminum" },
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
];

describe("applyFilters", () => {
  it("returns all products when no filters set", () => {
    const params = new URLSearchParams();
    expect(applyFilters(mockProducts, params)).toHaveLength(3);
  });

  it("filters by category", () => {
    const params = new URLSearchParams({ category: "Footwear" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.category === "Footwear")).toBe(true);
  });

  it("filters by brand (multiple)", () => {
    const params = new URLSearchParams({ brands: "Nike,Apple" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.brand)).toEqual(expect.arrayContaining(["Nike", "Apple"]));
  });

  it("filters by price range", () => {
    const params = new URLSearchParams({ minPrice: "100", maxPrice: "300" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.price >= 100 && p.price <= 300)).toBe(true);
  });

  it("filters by availability", () => {
    const params = new URLSearchParams({ availability: "out_of_stock" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(1);
    expect(result[0].brand).toBe("Adidas");
  });

  it("filters by search query (name match)", () => {
    const params = new URLSearchParams({ search: "macbook" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("filters by minimum rating", () => {
    const params = new URLSearchParams({ minRating: "4.8" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(2);
  });

  it("filters by color attribute", () => {
    const params = new URLSearchParams({ color: "white" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by size attribute", () => {
    const params = new URLSearchParams({ size: "43" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by material attribute", () => {
    const params = new URLSearchParams({ material: "aluminum" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("filters by SKU exact match", () => {
    const params = new URLSearchParams({ search: "NK-001" });
    const result = applyFilters(mockProducts, params);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("returns empty array when no products match", () => {
    const params = new URLSearchParams({ category: "NonExistent" });
    expect(applyFilters(mockProducts, params)).toHaveLength(0);
  });
});

describe("applySort", () => {
  it("sorts by price ascending", () => {
    const result = applySort(mockProducts, "price_asc");
    expect(result[0].price).toBe(120);
    expect(result[2].price).toBe(1999);
  });

  it("sorts by price descending", () => {
    const result = applySort(mockProducts, "price_desc");
    expect(result[0].price).toBe(1999);
    expect(result[2].price).toBe(120);
  });

  it("sorts by rating descending", () => {
    const result = applySort(mockProducts, "rating_desc");
    expect(result[0].rating.average).toBe(4.9);
  });

  it("returns original order when no sort specified", () => {
    const result = applySort(mockProducts, null);
    expect(result.map((p) => p.id)).toEqual(["1", "2", "3"]);
  });

  it("sorts by newest (createdAt desc)", () => {
    const result = applySort(mockProducts, "newest");
    expect(result[0].id).toBe("3");
  });

  it("sorts by popularity (rating count desc)", () => {
    const result = applySort(mockProducts, "popularity");
    expect(result[0].id).toBe("3");
  });

  it("sorts by relevance with exact name match at top", () => {
    const result = applySort(mockProducts, "relevance", "Nike Air Max");
    expect(result[0].id).toBe("1");
  });

  it("does not mutate original array", () => {
    const original = [...mockProducts];
    applySort(mockProducts, "price_asc");
    expect(mockProducts.map((p) => p.id)).toEqual(original.map((p) => p.id));
  });
});
