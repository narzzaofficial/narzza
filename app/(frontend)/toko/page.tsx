import type { Metadata } from "next";
import { getTokoPageData } from "@/lib/data";
import { ProductCard } from "@/components/toko/product-card";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Toko Merchandise Digital",
  description:
    "Belanja produk premium untuk developer dan tech enthusiast. Kaos, hoodie, stiker, dan merchandise digital berkualitas.",
  openGraph: {
    title: "Toko Merchandise — Narzza Media Digital",
    description: "Produk premium untuk developer dan tech enthusiast.",
    url: "https://narzza.com/toko",
    type: "website",
  },
  alternates: { canonical: "/toko" },
};

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
        <p className="mt-3 max-w-xl text-slate-300 text-sm">
          Produk premium untuk para developer dan tech enthusiast.
        </p>
      </header>

      {/* Featured Section */}
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-100">
            <span className="h-2 w-2 rounded-full bg-orange-500" /> Produk
            Unggulan
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} featured />
            ))}
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        <button className="rounded-full bg-cyan-600 px-5 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-500">
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className="toko-filter-btn rounded-full border px-5 py-1.5 text-xs font-medium transition"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state py-16 text-center rounded-2xl">
          <p className="text-slate-500">Katalog sedang kosong...</p>
        </div>
      )}
    </div>
  );
}
