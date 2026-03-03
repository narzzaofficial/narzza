import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { products as dummyProducts, type Product } from "@/types/products";
import { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";

function mapProductDoc(item: Record<string, unknown>): Product {
  return {
    _id: (item._id as { toString(): string } | undefined)?.toString(),
    id: item.id as string,
    name: item.name as string,
    description: (item.description as string) ?? "",
    price: item.price as number,
    images: (item.images as string[]) ?? [],
    category: item.category as string,
    categoryId: item.categoryId as string | undefined,
    stock: (item.stock as number) ?? 0,
    featured: (item.featured as boolean) ?? false,
    productType: (item.productType as "physical" | "digital") ?? "physical",
    platforms: item.platforms as Product["platforms"],
    createdAt: item.createdAt as number | undefined,
    updatedAt: item.updatedAt as number | undefined,
  };
}

async function loadProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    if (!db) return dummyProducts;
    const docs = await db
      .collection("products")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    if (docs.length === 0) return dummyProducts;
    return docs.map(mapProductDoc);
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
  // Direct DB lookup first
  try {
    const db = await getDb();
    if (db) {
      const doc = await db.collection("products").findOne({ id });
      if (doc) return mapProductDoc(doc);
    }
  } catch { /* fall through */ }

  // Fallback: cached list covers dummy data & DB-down scenario
  const all = await getProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getProductIds(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.id);
}
