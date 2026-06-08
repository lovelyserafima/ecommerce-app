import { render, screen, fireEvent } from "@testing-library/react";
import AvailabilityFilter from "@/components/filters/AvailabilityFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import type { Product } from "@/types/product";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

const products: Product[] = [
  {
    id: "1", name: "Product A", description: "", price: 100, images: [],
    brand: "Nike", category: "Footwear", subcategory: "Sneakers", sku: "NK-001",
    availability: "in_stock", rating: { average: 4, count: 10 },
    attributes: {}, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2", name: "Product B", description: "", price: 200, images: [],
    brand: "Adidas", category: "Footwear", subcategory: "Running", sku: "AD-001",
    availability: "out_of_stock", rating: { average: 4, count: 10 },
    attributes: {}, createdAt: "2024-02-01T00:00:00Z", updatedAt: "2024-02-01T00:00:00Z",
  },
];

function renderWithProvider() {
  return render(
    <FiltersProvider products={products}>
      <AvailabilityFilter />
    </FiltersProvider>
  );
}

describe("AvailabilityFilter", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders Availability heading", () => {
    renderWithProvider();
    expect(screen.getByText("Availability")).toBeInTheDocument();
  });

  it("renders only availability values present in products", () => {
    renderWithProvider();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.queryByText("Out of Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Pre-order")).not.toBeInTheDocument();
  });

  it("calls router.push with availability param on click", () => {
    renderWithProvider();
    fireEvent.click(screen.getByText("In Stock"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("availability=in_stock")
    );
  });
});
