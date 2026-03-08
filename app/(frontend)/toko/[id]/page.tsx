import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getTokoDetailData, getProducts } from "@/lib/data";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductActions } from "@/components/toko/product-actions";
import { ProductInfo } from "@/components/toko/product-info";
import { JsonLd } from "@/components/JsonLd";

type PageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getTokoDetailData(id);
  if (!data) return { title: "Produk Tidak Ditemukan" };
  const { product } = data;
  return {
    title: `${product.name} — Toko Narzza`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Toko Narzza Media Digital`,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
    alternates: { canonical: `/toko/${id}` },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const data = await getTokoDetailData(id);
  if (!data) notFound();
  const { product } = data;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images[0] ?? "",
          url: `/toko/${product.id}`,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "IDR",
            availability:
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }}
      />
      <div className="mb-4">
        <Link href="/toko" className="detail-back-btn">
          Kembali ke Toko
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
