import { render, screen, fireEvent } from "@testing-library/react";
import PriceFilter from "@/components/filters/PriceFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import { products } from "@/lib/products";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

const prices = products.map((p) => p.price);
const priceMin = Math.floor(Math.min(...prices));
const priceMax = Math.ceil(Math.max(...prices));

function renderWithProvider(ui: React.ReactElement) {
  return render(<FiltersProvider products={products}>{ui}</FiltersProvider>);
}

describe("PriceFilter", () => {
  it("renders Price heading", () => {
    renderWithProvider(<PriceFilter />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("renders two range inputs", () => {
    renderWithProvider(<PriceFilter />);
    const inputs = screen.getAllByRole("slider");
    expect(inputs).toHaveLength(2);
  });

  it("renders default price range display", () => {
    renderWithProvider(<PriceFilter />);
    expect(screen.getByText(`$${priceMin} – $${priceMax}`)).toBeInTheDocument();
  });

  it("updates min price display on input change", () => {
    renderWithProvider(<PriceFilter />);
    const [minInput] = screen.getAllByRole("slider");
    fireEvent.change(minInput, { target: { value: "500" } });
    expect(screen.getByText(`$500 – $${priceMax}`)).toBeInTheDocument();
  });
});
