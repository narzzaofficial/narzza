import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getDb } from "@/lib/mongodb";

import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductActions } from "@/components/toko/product-actions";
import { ProductInfo } from "@/components/toko/product-info";
import { getProductById, Product } from "@/types/products";

export const dynamic = "force-dynamic";

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const db = await getDb();
    const data = db ? await db.collection("products").findOne({ id }) : null;
    const productData = data || getProductById(id);

    if (!productData) return null;

    return {
      ...productData,
      _id: productData._id?.toString(),
    } as Product;
  } catch {
    return getProductById(id) ?? null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) return { title: "Produk Tidak Ditemukan" };
  return {
    title: `${product.name} - Toko Narzza Media Digital`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) notFound();

  return (
    <>
      <div className="mb-4">
        <Link href="/toko" className="detail-back-btn">
          ← Kembali ke Toko
        </Link>
      </div>

      <div className="space-y-4">
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          featured={product.featured}
        />

        <ProductInfo product={product} />

        <ProductActions product={product} />
      </div>
    </>
  );
}
