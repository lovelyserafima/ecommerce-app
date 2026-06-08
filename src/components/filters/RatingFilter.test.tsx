import { render, screen, fireEvent } from "@testing-library/react";
import RatingFilter from "@/components/filters/RatingFilter";
import { ratings } from "@/lib/products";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("RatingFilter", () => {
  beforeEach(() => mockPush.mockClear());

  it("renders Rating heading", () => {
    render(<RatingFilter />);
    expect(screen.getByText("Rating")).toBeInTheDocument();
  });

  it("renders a button for each rating", () => {
    render(<RatingFilter />);
    for (const rating of ratings) {
      expect(screen.getByText(`⭐ ${rating} Stars & Up`)).toBeInTheDocument();
    }
  });

  it("calls router.push with minRating on click", () => {
    render(<RatingFilter />);
    fireEvent.click(screen.getByText(`⭐ ${ratings[0]} Stars & Up`));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining(`minRating=${ratings[0]}`)
    );
  });
});
