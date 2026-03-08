import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import type { IProduct } from "@/lib/models/Product";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";
import type { Product } from "@/types/products";

function docToProduct(d: IProduct): Product {
  return {
    id: d.id,
    name: d.name,
    description: d.description,
    price: d.price,
    images: d.images ?? [],
    category: d.category,
    categoryId: d.categoryId,
    stock: d.stock ?? 0,
    featured: d.featured ?? false,
    productType: d.productType,
    platforms: d.platforms,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

async function loadProducts(): Promise<Product[]> {
  try {
    const conn = await connectDB();
    if (!conn) return [];
    const docs = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return docs.map(docToProduct);
  } catch {
    return [];
  }
}

export const getProducts = unstable_cache(
  async () => loadProducts(),
  ["cached-products"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);
