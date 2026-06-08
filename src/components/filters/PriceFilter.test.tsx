import { render, screen } from "@testing-library/react";
import PriceFilter from "@/components/filters/PriceFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";
import { products } from "@/lib/products";

jest.mock("@radix-ui/react-slider", () => ({
  Root: ({ value, onValueChange, children }: { value: number[]; onValueChange: (v: number[]) => void; children: React.ReactNode }) => (
    <div data-testid="slider-root">{children}</div>
  ),
  Track: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Range: () => <div />,
  Thumb: () => <span role="slider" />,
}));

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

  it("renders two slider thumbs", () => {
    renderWithProvider(<PriceFilter />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
  });

  it("renders boundary labels", () => {
    renderWithProvider(<PriceFilter />);
    expect(screen.getByText(`$${priceMin}`)).toBeInTheDocument();
    expect(screen.getByText(`$${priceMax}`)).toBeInTheDocument();
  });

  it("renders selected range display", () => {
    renderWithProvider(<PriceFilter />);
    expect(screen.getByText(`$${priceMin} – $${priceMax}`)).toBeInTheDocument();
  });
});
