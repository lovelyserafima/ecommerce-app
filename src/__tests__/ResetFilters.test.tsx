import { render, screen, fireEvent } from "@testing-library/react";
import ResetFilters from "@/components/filters/ResetFilters";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("ResetFilters", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders Reset Filters heading", () => {
    render(<ResetFilters />);
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("renders Clear All button", () => {
    render(<ResetFilters />);
    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("navigates to /products on click", () => {
    render(<ResetFilters />);
    fireEvent.click(screen.getByText("Clear All"));
    expect(mockPush).toHaveBeenCalledWith("/products");
  });
});
