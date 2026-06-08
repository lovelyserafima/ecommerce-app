import { NextResponse } from "next/server";
import { applyFilters, applySort } from "@/lib/filterProducts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = Math.max(1, Number(searchParams.get("perPage") ?? 24));

  const filtered = applySort(
    applyFilters(searchParams),
    searchParams.get("sort"),
    searchParams.get("search")
  );

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return NextResponse.json({ products: paginated, total });
}
