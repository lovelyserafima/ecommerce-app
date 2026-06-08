import { applyFilters, applySort } from "@/lib/filterProducts";
import { getAllProducts } from "@/lib/catalog";
import ProductGrid from "@/components/products/ProductGrid";
import SearchBar from "@/components/search/SearchBar";
import CategoryFilter from "@/components/filters/CategoryFilter";
import PriceFilter from "@/components/filters/PriceFilter";
import RatingFilter from "@/components/filters/RatingFilter";
import SortSelect from "@/components/ui/SortSelect";
import ResetFilters from "@/components/filters/ResetFilters";
import SavedSearches from "@/components/search/SavedSearches";
import SaveSearch from "@/components/search/SaveSearch";
import BrandFilter from "@/components/filters/BrandFilter";
import PerPageSelect from "@/components/ui/PerPageSelect";
import { Metadata } from "next";
import SubcategoryFilter from "@/components/filters/SubcategoryFilter";
import AvailabilityFilter from "@/components/filters/AvailabilityFilter";
import AttributeFilter from "@/components/filters/AttributeFilter";
import { FiltersProvider } from "@/components/filters/FiltersProvider";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
  page?: string;
  perPage?: string;
  brands?: string;
  color?: string;
  size?: string;
  material?: string;
  availability?: string;
  sku?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { search, category } = await searchParams;
  let title = "Product Catalog";
  if (search) title = `"${search}" — Product Catalog`;
  else if (category) title = `${category} — Product Catalog`;
  return { title, description: "Search and filter products from thousands of sellers" };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { search, category, subcategory, minPrice, maxPrice, minRating, sort,
    page, perPage, brands, color, size, material, availability, sku } = params;

  const urlParams = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
  );

  const allProducts = await getAllProducts();
  const filtered = applySort(applyFilters(allProducts, urlParams), sort ?? null, search);

  const currentPage = page ? Math.max(1, Number(page)) : 1;
  const itemsPerPage = perPage ? Math.max(1, Number(perPage)) : 24;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filterParams = Object.fromEntries(
    Object.entries({ search, category, subcategory, minPrice, maxPrice, minRating,
      sort, brands, color, size, material, availability, sku })
      .filter(([, v]) => v !== undefined) as [string, string][]
  );

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="flex gap-8">
        <aside style={{ width: "256px", minWidth: "256px", maxWidth: "256px" }} className="shrink-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-fit overflow-hidden">
          <FiltersProvider products={allProducts}>
          <CategoryFilter />
          <SubcategoryFilter />
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <PriceFilter />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <RatingFilter />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <SortSelect />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <BrandFilter />
          </div>
          <AttributeFilter attribute="color" label="Color" />
          <AttributeFilter attribute="size" label="Size" />
          <AttributeFilter attribute="material" label="Material" />
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <AvailabilityFilter />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <PerPageSelect />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ResetFilters />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <SavedSearches />
          </div>
          </FiltersProvider>
        </aside>
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <SaveSearch />
          </div>
          <ProductGrid
            key={JSON.stringify(filterParams)}
            initialProducts={paginated}
            total={filtered.length}
            filterParams={filterParams}
            perPage={itemsPerPage}
          />
        </div>
      </div>
    </main>
  );
}
