import { render, screen, fireEvent } from "@testing-library/react";
import PriceFilter from "@/components/filters/PriceFilter";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("PriceFilter", () => {
  it("renders Price heading", () => {
    render(<PriceFilter />);
    expect(screen.getByText("Price")).toBeInTheDocument();
  });

  it("renders two range inputs", () => {
    render(<PriceFilter />);
    const inputs = screen.getAllByRole("slider");
    expect(inputs).toHaveLength(2);
  });

  it("renders default price range display", () => {
    render(<PriceFilter />);
    expect(screen.getByText("$0 - $5000")).toBeInTheDocument();
  });

  it("updates min price display on input change", () => {
    render(<PriceFilter />);
    const [minInput] = screen.getAllByRole("slider");
    fireEvent.change(minInput, { target: { value: "500" } });
    expect(screen.getByText("$500 - $5000")).toBeInTheDocument();
  });
});
