export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  attributes: Record<string, string | number | boolean>;
  brand: string;
  category: string;
  subcategory: string;
  availability: "in_stock" | "out_of_stock" | "pre_order";
  sku: string;
  createdAt: string;
  updatedAt: string;
  originalPrice?: number;
  slug?: string;
}