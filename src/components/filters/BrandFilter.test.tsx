import { render, screen, fireEvent } from "@testing-library/react";
import BrandFilter from "@/components/filters/BrandFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import type { Product } from "@/types/product";

const mockPush = jest.fn();
const mockUseSearchParams = jest.fn(() => new URLSearchParams());

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockUseSearchParams(),
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
  beforeEach(() => {
    mockPush.mockClear();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

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

  it("calls router.push with brand param when brand clicked", () => {
    renderWithProvider();
    fireEvent.click(screen.getByText("Nike"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("brands=Nike")
    );
  });

  it("deselects brand when clicking already selected brand", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ brands: "Nike" }));
    renderWithProvider();
    fireEvent.click(screen.getByText("Nike"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.not.stringContaining("brands=Nike")
    );
  });
});
