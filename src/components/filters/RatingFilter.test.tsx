import { render, screen, fireEvent } from "@testing-library/react";
import RatingFilter from "@/components/filters/RatingFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import { products } from "@/lib/products";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

const ratings = Array.from(
  new Set(products.map((p) => Math.floor(p.rating.average)))
).sort((a, b) => a - b).slice(1);

function renderWithProvider(ui: React.ReactElement) {
  return render(<FiltersProvider products={products}>{ui}</FiltersProvider>);
}

describe("RatingFilter", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders Rating heading", () => {
    renderWithProvider(<RatingFilter />);
    expect(screen.getByText("Rating")).toBeInTheDocument();
  });

  it("renders a button for each rating", () => {
    renderWithProvider(<RatingFilter />);
    for (const rating of ratings) {
      expect(screen.getByText(`⭐ ${rating} Stars & Up`)).toBeInTheDocument();
    }
  });

  it("calls router.push with minRating on click", () => {
    renderWithProvider(<RatingFilter />);
    fireEvent.click(screen.getByText(`⭐ ${ratings[0]} Stars & Up`));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`minRating=${ratings[0]}`)
    );
  });
});
