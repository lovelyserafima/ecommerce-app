import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import PriceFilter from "@/components/PriceFilter";
import RatingFilter from "@/components/RatingFilter";
import SortSelect from "@/components/SortSelect";
import ResetFilters from "@/components/ResetFilters";
import Pagination from "@/components/Pagination";
import SavedSearches from "@/components/SavedSearches";
import SaveSearch from "@/components/SaveSearch";
import BrandFilter from "@/components/BrandFilter";
import PerPageSelect from "@/components/PerPageSelect";
import { Metadata } from "next";
import ColorFilter from "@/components/ColorFilter";
import SubcategoryFilter from "@/components/SubcategoryFilter";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; minPrice?: string; maxPrice?: string; 
    minRating?: string; sort?: string; page?: string; perPage?: string; brands?: string; colors?: string; sku?: string; description?: string;}>;
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
  searchParams: Promise<{ search?: string; category?: string; minPrice?: string; maxPrice?: string; 
    minRating?: string; sort?: string; page?: string; perPage?: string; brands?: string; colors?: string; sku?: string; description?: string;}>;
}) {
  const { search, category, minPrice, maxPrice, minRating, sort, page, perPage, brands, colors, sku, description } = await searchParams;

  let filtered = products.filter((p) => {
    const matchesSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase() === search.toLowerCase()
      : true;
    const matchesCategory = category ? p.category === category : true;
    const matchesMinPrice = minPrice ? p.price >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? p.price <= Number(maxPrice) : true;
    const matchesMinRating = minRating ? p.rating.average >= Number(minRating) : true;
    const matchesBrands = brands ? brands.split(",").includes(p.brand) : true;
    const matchesColors = colors ? colors.split(",").includes(String(p.attributes.color)) : true;
    const matchesSku = sku ? p.sku === sku : true;
    const matchesDescription = description ? p.description.toLowerCase().includes(description.toLowerCase()) : true;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesMinRating && matchesBrands && matchesColors && matchesSku && matchesDescription;
  });

  if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating_desc") {
      filtered.sort((a, b) => b.rating.average - a.rating.average);
  } else if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === "popularity") {
      filtered.sort((a, b) => b.rating.count - a.rating.count);
  } else if (sort === "relevance" && search) {
      const q = search.toLowerCase();
      const score = (p: typeof filtered[0]) => {
        if (p.name.toLowerCase() === q) return 3;
        if (p.name.toLowerCase().includes(q)) return 2;
        if (p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) return 1;
        return 0;
      };
      filtered.sort((a, b) => score(b) - score(a));
  }

  const currentPage = page ? Math.max(1, Number(page)) : 1;
  const itemsPerPage = perPage ? Math.max(1, Number(perPage)) : 24;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="flex gap-8">
        <aside style={{ width: '256px', minWidth: '256px', maxWidth: '256px' }} className="shrink-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-fit overflow-hidden">
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
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ColorFilter />
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
        </aside>
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <SaveSearch />
          </div>
            {paginated.length === 0 ? (
                <p className="text-gray-500">No products found. Try adjusting your filters.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginated.map((product) => (
                         <ProductCard key={product.id} product={product} />
                    ))}
                 </div>
                )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchParams={Object.fromEntries(
                 Object.entries({ search, category, minPrice, maxPrice, minRating, sort, brands, colors, sku, description })
                    .filter(([, v]) => v !== undefined) as [string, string][]
                )}
            />
        </div>
      </div>
    </main>
  );
}