import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import type { IProduct } from "@/lib/models/Product";
import { products as dummyProducts, type Product } from "@/types/products";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

/**
 * Convert a raw Mongoose Product document into a plain Product object.
 * Explicit field mapping avoids leaking internal Mongoose fields (like _id).
 */
function docToProduct(d: IProduct): Product {
  return {
    id: d.id,
    name: d.name,
    description: d.description ?? "",
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
    if (!conn) return dummyProducts;
    const docs = await ProductModel.find().sort({ createdAt: -1 }).lean();
    // If DB is empty, fall back to in-memory dummy data
    if (docs.length === 0) return dummyProducts;
    return docs.map(docToProduct);
  } catch {
    return dummyProducts;
  }
}

export const getProducts = unstable_cache(
  async () => loadProducts(),
  ["cached-products"],
  { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] }
);

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const conn = await connectDB();
    if (conn) {
      const doc = await ProductModel.findOne({ id }).lean();
      if (doc) return docToProduct(doc);
    }
  } catch { /* fall through to cache */ }

  // Fall back to the cached list if DB lookup fails
  const all = await getProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getProductIds(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.id);
}
