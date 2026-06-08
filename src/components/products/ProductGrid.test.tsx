import { render, screen } from "@testing-library/react";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product } from "@/types/product";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const makeProduct = (id: string): Product => ({
  id,
  name: `Product ${id}`,
  description: "desc",
  price: 100,
  images: ["https://example.com/img.jpg"],
  brand: "Nike",
  category: "Footwear",
  subcategory: "Sneakers",
  sku: `SKU-${id}`,
  availability: "in_stock",
  rating: { average: 4.5, count: 10 },
  attributes: {},
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
});

describe("ProductGrid", () => {
  it("renders all product cards", () => {
    const products = [makeProduct("1"), makeProduct("2")];
    render(<ProductGrid initialProducts={products} total={2} filterParams={{}} perPage={24} />);
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("shows empty state when no products", () => {
    render(<ProductGrid initialProducts={[]} total={0} filterParams={{}} perPage={24} />);
    expect(screen.getByText(/No products found/)).toBeInTheDocument();
  });

  it("shows Load more button when there are more products", () => {
    const products = [makeProduct("1")];
    render(<ProductGrid initialProducts={products} total={10} filterParams={{}} perPage={24} />);
    expect(screen.getByText("Load more")).toBeInTheDocument();
  });

  it("hides Load more button when all products are loaded", () => {
    const products = [makeProduct("1"), makeProduct("2")];
    render(<ProductGrid initialProducts={products} total={2} filterParams={{}} perPage={24} />);
    expect(screen.queryByText("Load more")).not.toBeInTheDocument();
  });

  it("shows all products loaded message when all loaded and exceed perPage", () => {
    const products = Array.from({ length: 5 }, (_, i) => makeProduct(String(i)));
    render(<ProductGrid initialProducts={products} total={5} filterParams={{}} perPage={2} />);
    expect(screen.getByText("All products loaded")).toBeInTheDocument();
  });
});
