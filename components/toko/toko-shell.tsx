"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/toko/product-card";
import type { Product } from "@/types/products";

type Props = {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
};

export function TokoShell({ products, featuredProducts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Semua") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const filteredFeatured = useMemo(() => {
    if (activeCategory === "Semua") return featuredProducts;
    return featuredProducts.filter((p) => p.category === activeCategory);
  }, [featuredProducts, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {["Semua", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-1.5 text-xs font-bold transition ${
              activeCategory === cat
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                : "border border-slate-600/50 bg-slate-800/40 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Section */}
      {filteredFeatured.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Produk Unggulan
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFeatured.map((p) => (
              <ProductCard key={p.id} product={p} featured />
            ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state rounded-2xl py-16 text-center">
          <p className="text-slate-500">
            Tidak ada produk dalam kategori ini.
          </p>
        </div>
      )}
    </div>
  );
}

