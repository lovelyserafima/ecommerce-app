import { render, screen, fireEvent } from "@testing-library/react";
import SubcategoryFilter from "@/components/filters/SubcategoryFilter";
import { subcategoriesByCategory } from "@/lib/products";

const mockPush = jest.fn();
const mockUseSearchParams = jest.fn(() => new URLSearchParams());

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockUseSearchParams(),
}));

describe("SubcategoryFilter", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  it("renders nothing when no category selected", () => {
    const { container } = render(<SubcategoryFilter />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders subcategories for selected category", () => {
    const category = Object.keys(subcategoriesByCategory)[0];
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category }));
    render(<SubcategoryFilter />);
    expect(screen.getByText("Subcategory")).toBeInTheDocument();
    for (const sub of subcategoriesByCategory[category]) {
      expect(screen.getByText(sub)).toBeInTheDocument();
    }
  });

  it("calls router.push on subcategory click", () => {
    const category = Object.keys(subcategoriesByCategory)[0];
    const sub = subcategoriesByCategory[category][0];
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category }));
    render(<SubcategoryFilter />);
    fireEvent.click(screen.getByText(sub));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`subcategory=${encodeURIComponent(sub)}`)
    );
  });

  it("collapses list on toggle click", () => {
    const category = Object.keys(subcategoriesByCategory)[0];
    const sub = subcategoriesByCategory[category][0];
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ category }));
    render(<SubcategoryFilter />);
    fireEvent.click(screen.getByText("Subcategory").closest("button")!);
    expect(screen.queryByText(sub)).not.toBeInTheDocument();
  });
});
