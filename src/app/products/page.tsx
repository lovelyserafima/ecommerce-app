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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; minPrice?: string; maxPrice?: string; 
    minRating?: string; sort?: string; page?: string; perPage?: string; brands?: string;}>;
}) {
  const { search, category, minPrice, maxPrice, minRating, sort, page, perPage, brands } = await searchParams;

  let filtered = products.filter((p) => {
    const matchesSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = category ? p.category === category : true;
    const matchesMinPrice = minPrice ? p.price >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? p.price <= Number(maxPrice) : true;
    const matchesMinRating = minRating ? p.rating.average >= Number(minRating) : true;
    const matchesBrands = brands ? brands.split(",").includes(p.brand) : true;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesMinRating && matchesBrands;
  });

  if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating_desc") {
      filtered.sort((a, b) => b.rating.average - a.rating.average);
  } else if (sort === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const currentPage = page ? Math.max(1, Number(page)) : 1;
  const itemsPerPage = perPage ? Math.max(1, Number(perPage)) : 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="flex gap-8">
        <aside className="w-64 shrink-0">
          <CategoryFilter />
          <div className="mt-6">
            <PriceFilter />
          </div>
          <div className="mt-6">
            <RatingFilter />
          </div>
          <div className="mt-6">
            <SortSelect />
          </div>
          <div className="mt-6">
            <BrandFilter />
          </div>
          <div className="mt-6">
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
                 Object.entries({ search, category, minPrice, maxPrice, minRating, sort, brands})
                    .filter(([, v]) => v !== undefined) as [string, string][]
                )}
            />
        </div>
      </div>
    </main>
  );
}