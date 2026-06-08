import { render, screen, fireEvent } from "@testing-library/react";
import CategoryFilter from "@/components/filters/CategoryFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import { products } from "@/lib/products";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

const categories = Array.from(new Set(products.map((p) => p.category))).sort();

function renderWithProvider(ui: React.ReactElement) {
  return render(<FiltersProvider products={products}>{ui}</FiltersProvider>);
}

describe("CategoryFilter", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders Category heading", () => {
    renderWithProvider(<CategoryFilter />);
    expect(screen.getByText("Category")).toBeInTheDocument();
  });

  it("renders all category buttons", () => {
    renderWithProvider(<CategoryFilter />);
    for (const category of categories) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  });

  it("calls router.push with category param on click", () => {
    renderWithProvider(<CategoryFilter />);
    fireEvent.click(screen.getByText(categories[0]));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`category=${encodeURIComponent(categories[0])}`)
    );
  });

  it("removes category param when clicking selected category", () => {
    const searchParams = new URLSearchParams({ category: categories[0] });
    jest.spyOn(require("next/navigation"), "useSearchParams").mockReturnValue(searchParams);
    renderWithProvider(<CategoryFilter />);
    fireEvent.click(screen.getByText(categories[0]));
    expect(mockPush).toHaveBeenCalledWith(
      expect.not.stringContaining("category=")
    );
  });
});
