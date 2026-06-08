export const PRICE_MIN = 0;
export const PRICE_MAX = 5000;

export const DEFAULT_PER_PAGE = 24;
export const PER_PAGE_OPTIONS = [24, 48, 96];

export const RATING_OPTIONS = [1, 2, 3, 4, 5];

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Most Popular" },
];
