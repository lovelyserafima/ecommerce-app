import { render, screen, fireEvent } from "@testing-library/react";
import QuickViewModal from "@/components/products/QuickViewModal";
import type { Product } from "@/types/product";

const mockProduct: Product = {
  id: "1",
  name: "Nike Air Max",
  description: "Great sneakers",
  price: 120,
  images: ["https://example.com/image.jpg"],
  brand: "Nike",
  category: "Footwear",
  subcategory: "Sneakers",
  sku: "NK-001",
  availability: "in_stock",
  rating: { average: 4.5, count: 100 },
  attributes: {},
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("QuickViewModal", () => {
  it("renders product name", () => {
    render(<QuickViewModal product={mockProduct} onClose={jest.fn()} />);
    expect(screen.getByText("Nike Air Max")).toBeInTheDocument();
  });

  it("renders product description", () => {
    render(<QuickViewModal product={mockProduct} onClose={jest.fn()} />);
    expect(screen.getByText("Great sneakers")).toBeInTheDocument();
  });

  it("renders In Stock for in_stock product", () => {
    render(<QuickViewModal product={mockProduct} onClose={jest.fn()} />);
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("renders Out of Stock for out_of_stock product", () => {
    render(<QuickViewModal product={{ ...mockProduct, availability: "out_of_stock" }} onClose={jest.fn()} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("calls onClose when ✕ button clicked", () => {
    const onClose = jest.fn();
    render(<QuickViewModal product={mockProduct} onClose={onClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop clicked", () => {
    const onClose = jest.fn();
    const { container } = render(<QuickViewModal product={mockProduct} onClose={onClose} />);
    fireEvent.click(container.firstChild!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
