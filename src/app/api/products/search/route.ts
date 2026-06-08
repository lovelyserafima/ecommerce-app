import { NextResponse } from "next/server";
import { getRepository } from "@/services/productService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");

  if (!search || search.length < 2) return NextResponse.json([]);

  const { products } = await getRepository().findMany({ search, perPage: 5 });

  return NextResponse.json(products.map(({ id, name }) => ({ id, name })));
}
