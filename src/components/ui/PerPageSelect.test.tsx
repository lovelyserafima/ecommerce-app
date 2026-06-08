import { render, screen, fireEvent } from "@testing-library/react";
import PerPageSelect from "@/components/ui/PerPageSelect";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("PerPageSelect", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders Show label", () => {
    render(<PerPageSelect />);
    expect(screen.getByText("Show:")).toBeInTheDocument();
  });

  it("renders options 24, 48, 96", () => {
    render(<PerPageSelect />);
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("96")).toBeInTheDocument();
  });

  it("calls router.push with perPage and page=1 on change", () => {
    render(<PerPageSelect />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "48" } });
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("perPage=48")
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("page=1")
    );
  });
});
