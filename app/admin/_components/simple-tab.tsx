"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Category, Product } from "../_types";
import { Roadmap } from "@/types/roadmaps";

export function RoadmapTab({
  roadmaps,
  onDelete,
}: {
  roadmaps: Roadmap[];
  onDelete?: (slug: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return roadmaps;
    return roadmaps.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.level.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [roadmaps, search]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Daftar Roadmap</h2>
        <Link
          href="/admin/roadmaps"
          className="admin-btn admin-btn-primary rounded-lg sm:rounded-xl bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white"
        >
          + Tambah Roadmap
        </Link>
      </div>

      {/* Search */}
      {roadmaps.length > 0 && (
        <div className="mb-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari roadmap, level, atau tag..."
            className="w-full rounded-xl border border-slate-600/50 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400/60"
          />
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400">
            {search ? "Tidak ada hasil pencarian." : "Belum ada roadmap."}
          </p>
        )}
        {filtered.map((roadmap) => (
          <div
            key={roadmap.slug}
            className="admin-list-card glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex gap-2">
                <span className="text-cyan-300 text-[10px] bg-cyan-500/20 px-2 rounded-full">
                  {roadmap.level}
                </span>
              </div>
              <p className="truncate text-sm font-medium">{roadmap.title}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/admin/roadmaps?edit=${roadmap.slug}`}
                className="admin-btn admin-btn-secondary bg-slate-700/60 px-3 py-1.5 rounded-lg text-xs"
              >
                Edit
              </Link>
              <Link
                href={`/roadmap/${roadmap.slug}`}
                target="_blank"
                className="admin-btn admin-btn-info bg-cyan-700/40 px-3 py-1.5 rounded-lg text-xs text-cyan-200"
              >
                Lihat
              </Link>
              <button
                type="button"
                onClick={() => onDelete?.(roadmap.slug)}
                className="admin-btn rounded-lg border border-rose-500/50 px-3 py-1.5 text-xs text-rose-400 transition hover:bg-rose-500/10 hover:border-rose-400"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductTab({ products }: { products: Product[] }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Daftar Produk</h2>
        <Link
          href="/admin/products"
          className="admin-btn admin-btn-primary rounded-lg bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white"
        >
          🛒 Kelola Produk
        </Link>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="admin-list-card glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover bg-slate-900/60"
                />
              )}
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-cyan-400">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/products"
                className="admin-btn admin-btn-secondary bg-slate-700/60 px-3 py-1.5 rounded-lg text-xs"
              >
                ✏️ Edit
              </Link>
              <Link
                href={`/toko/${product.id}`}
                target="_blank"
                className="admin-btn admin-btn-info bg-cyan-700/40 px-3 py-1.5 rounded-lg text-xs text-cyan-200"
              >
                👁️ Lihat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryTab({ categories }: { categories: Category[] }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Daftar Kategori</h2>
        <Link
          href="/admin/categories"
          className="admin-btn admin-btn-primary rounded-lg bg-cyan-600/80 px-3 py-1.5 text-sm font-semibold text-white"
        >
          🏷️ Kelola Kategori
        </Link>
      </div>
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="admin-list-card glass-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900/60 text-2xl">
                {category.icon || "🏷️"}
              </div>
              <div>
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-slate-500">/{category.slug}</p>
              </div>
            </div>
            <Link
              href="/admin/categories"
              className="admin-btn admin-btn-secondary bg-slate-700/60 px-3 py-1.5 rounded-lg text-xs"
            >
              ✏️ Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
