import { render, screen, fireEvent } from "@testing-library/react";
import SortSelect from "@/components/ui/SortSelect";
import { sortOptions } from "@/lib/products";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("SortSelect", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders Sort By heading", () => {
    render(<SortSelect />);
    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("renders Default option", () => {
    render(<SortSelect />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it("renders all sort options", () => {
    render(<SortSelect />);
    for (const option of sortOptions) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it("calls router.push with sort param on change", () => {
    render(<SortSelect />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: sortOptions[0].value },
    });
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`sort=${sortOptions[0].value}`)
    );
  });
});
