/**
 * toko-page.ts
 * Centralized data loader untuk halaman toko (/toko dan /toko/[id]).
 */

import type { Product } from "@/types/products";
import { getProducts } from "./products";

export type TokoPageData = {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
};

export type TokoDetailData = {
  product: Product;
  relatedProducts: Product[];
};

/** Load semua produk beserta derived data untuk halaman listing */
export async function getTokoPageData(): Promise<TokoPageData> {
  const products = await getProducts();
  const featuredProducts = products.filter((p) => p.featured);
  const categories = Array.from(new Set(products.map((p) => p.category)));
  return { products, featuredProducts, categories };
}

/** Load satu produk + produk terkait (kategori sama) */
export async function getTokoDetailData(
  id: string
): Promise<TokoDetailData | null> {
  const allProducts = await getProducts(); // ← fetch sekali saja
  const product = allProducts.find((p) => p.id === id);
  if (!product) return null;

  const relatedProducts = allProducts
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, 4);

  return { product, relatedProducts };
}

export async function getProductStaticIds(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.id);
}
