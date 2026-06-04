import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  function buildUrl(page: number) {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `/products?${params.toString()}`;
  }

  return (
    <div className="flex justify-center gap-4 mt-8">
      {currentPage > 1 && (
        <Link href={buildUrl(currentPage - 1)} className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          Previous
        </Link>
      )}
      <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && (
        <Link href={buildUrl(currentPage + 1)} className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          Next
        </Link>
      )}
    </div>
  );
}