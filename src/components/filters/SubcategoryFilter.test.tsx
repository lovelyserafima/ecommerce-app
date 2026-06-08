import { render, screen, fireEvent } from "@testing-library/react";
import SubcategoryFilter from "@/components/filters/SubcategoryFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import { products } from "@/lib/products";

const mockPush = jest.fn();
const mockUseSearchParams = jest.fn(() => new URLSearchParams());

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockUseSearchParams(),
}));

const category = products[0].category;
const subcategoriesByCategory = products.reduce<Record<string, string[]>>((acc, p) => {
  if (!acc[p.category]) acc[p.category] = [];
  if (!acc[p.category].includes(p.subcategory)) acc[p.category].push(p.subcategory);
  return acc;
}, {});

function renderWithProvider(ui: React.ReactElement) {
  return render(<FiltersProvider products={products}>{ui}</FiltersProvider>);
}

describe("SubcategoryFilter", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("renders nothing when no category selected", () => {
    const { container } = renderWithProvider(<SubcategoryFilter />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders subcategories for selected category", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category }));
    renderWithProvider(<SubcategoryFilter />);
    expect(screen.getByText("Subcategory")).toBeInTheDocument();
    for (const sub of subcategoriesByCategory[category]) {
      expect(screen.getByText(sub)).toBeInTheDocument();
    }
  });

  it("calls router.push on subcategory click", () => {
    const sub = subcategoriesByCategory[category][0];
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category }));
    renderWithProvider(<SubcategoryFilter />);
    fireEvent.click(screen.getByText(sub));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`subcategory=${encodeURIComponent(sub)}`)
    );
  });

  it("collapses list on toggle click", () => {
    const sub = subcategoriesByCategory[category][0];
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category }));
    renderWithProvider(<SubcategoryFilter />);
    fireEvent.click(screen.getByText("Subcategory").closest("button")!);
    expect(screen.queryByText(sub)).not.toBeInTheDocument();
  });
});
