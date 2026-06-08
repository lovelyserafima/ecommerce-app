import { NextResponse } from "next/server";
import { getProducts } from "@/services/productService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  const { allProducts } = await getProducts({ search });

  const filtered = search
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : allProducts;

  return NextResponse.json(
    filtered.slice(0, 5).map(({ id, name }) => ({ id, name }))
  );
}
