import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockProduct: Product = {
  id: "1",
  name: "Nike Air Max",
  description: "Great sneakers",
  price: 120,
  originalPrice: 150,
  images: ["https://example.com/image.jpg"],
  brand: "Nike",
  category: "Footwear",
  subcategory: "Sneakers",
  sku: "NK-001",
  availability: "in_stock",
  rating: { average: 4.5, count: 100 },
  attributes: { color: "white", size: "42", material: "mesh" },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Nike Air Max")).toBeInTheDocument();
  });

  it("renders product brand", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Nike")).toBeInTheDocument();
  });

  it("renders product price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$120")).toBeInTheDocument();
  });

  it("renders original price when available", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$150")).toBeInTheDocument();
  });

  it("renders rating", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
  });

  it("does not show out of stock badge for in_stock product", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText("Out of stock")).not.toBeInTheDocument();
  });

  it("shows out of stock badge when availability is out_of_stock", () => {
    render(<ProductCard product={{ ...mockProduct, availability: "out_of_stock" }} />);
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("opens quick view modal on button click", () => {
    render(<ProductCard product={mockProduct} />);
    const quickViewBtn = screen.getByText("Quick View");
    fireEvent.click(quickViewBtn);
    expect(screen.getByText("Great sneakers")).toBeInTheDocument();
  });
});
