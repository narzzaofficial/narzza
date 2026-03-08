import type { Metadata } from "next";
import { getTokoPageData } from "@/lib/data";
import { TokoShell } from "@/components/toko/toko-shell";
import { createPageMeta } from "@/lib/metadata";

export const metadata: Metadata = createPageMeta({
  title: "Toko Merchandise Digital",
  description:
    "Belanja produk premium untuk developer dan tech enthusiast. Kaos, hoodie, stiker, dan merchandise digital berkualitas.",
  path: "/toko",
});

export default async function TokoPage() {
  const { products, featuredProducts, categories } = await getTokoPageData();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <header className="page-hero">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
          Narzza Store
        </span>
        <h1 className="mt-2 text-2xl font-bold text-slate-50 md:text-3xl">
          🛒 Merchandise Digital
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-300">
          Produk premium untuk para developer dan tech enthusiast.
        </p>
      </header>

      {/* Interactive shell: filter bar + product grid */}
      <TokoShell
        products={products}
        featuredProducts={featuredProducts}
        categories={categories}
      />
    </div>
  );
}
