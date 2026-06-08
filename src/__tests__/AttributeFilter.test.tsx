import { render, screen, fireEvent } from "@testing-library/react";
import AttributeFilter from "@/components/filters/AttributeFilter";
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
    attributes: { color: "white", size: "42", material: "mesh" },
    createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2", name: "Adidas Run", description: "", price: 200, images: [],
    brand: "Adidas", category: "Footwear", subcategory: "Running", sku: "AD-001",
    availability: "in_stock", rating: { average: 4.8, count: 50 },
    attributes: { color: "black", size: "43", material: "primeknit" },
    createdAt: "2024-02-01T00:00:00Z", updatedAt: "2024-02-01T00:00:00Z",
  },
];

describe("AttributeFilter", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("renders nothing when no category selected", () => {
    const { container } = render(
      <FiltersProvider products={products}>
        <AttributeFilter attribute="color" label="Color" />
      </FiltersProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders attribute values when category is selected", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category: "Footwear" }));
    render(
      <FiltersProvider products={products}>
        <AttributeFilter attribute="color" label="Color" />
      </FiltersProvider>
    );
    expect(screen.getByText("Color")).toBeInTheDocument();
    expect(screen.getByText("white")).toBeInTheDocument();
    expect(screen.getByText("black")).toBeInTheDocument();
  });

  it("calls router.push with attribute param on click", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category: "Footwear" }));
    render(
      <FiltersProvider products={products}>
        <AttributeFilter attribute="color" label="Color" />
      </FiltersProvider>
    );
    fireEvent.click(screen.getByText("white"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("color=white")
    );
  });
});
