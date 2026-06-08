import { render, screen, fireEvent } from "@testing-library/react";
import BrandFilter from "@/components/filters/BrandFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import type { Product } from "@/types/product";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const products: Product[] = [
  {
    id: "1", name: "Nike Air Max", description: "", price: 120, images: [],
    brand: "Nike", category: "Footwear", subcategory: "Sneakers", sku: "NK-001",
    availability: "in_stock", rating: { average: 4.5, count: 100 },
    attributes: {}, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2", name: "Adidas Ultraboost", description: "", price: 200, images: [],
    brand: "Adidas", category: "Footwear", subcategory: "Running", sku: "AD-001",
    availability: "in_stock", rating: { average: 4.8, count: 50 },
    attributes: {}, createdAt: "2024-02-01T00:00:00Z", updatedAt: "2024-02-01T00:00:00Z",
  },
];

function renderWithProvider() {
  return render(
    <FiltersProvider products={products}>
      <BrandFilter />
    </FiltersProvider>
  );
}

describe("BrandFilter", () => {
  it("renders brand list", () => {
    renderWithProvider();
    expect(screen.getByText("Nike")).toBeInTheDocument();
    expect(screen.getByText("Adidas")).toBeInTheDocument();
  });

  it("renders Brand heading", () => {
    renderWithProvider();
    expect(screen.getByText("Brand")).toBeInTheDocument();
  });

  it("collapses brand list when toggle clicked", () => {
    renderWithProvider();
    const toggle = screen.getByText("Brand").closest("button")!;
    fireEvent.click(toggle);
    expect(screen.queryByText("Nike")).not.toBeInTheDocument();
  });
});
