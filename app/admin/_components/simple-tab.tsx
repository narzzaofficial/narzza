"use client";
import Link from "next/link";
import { Category, Product } from "../_types";
import { Roadmap } from "@/types/roadmaps";

export function RoadmapTab({
  roadmaps,
}: {
  roadmaps: Roadmap[];
  onDelete?: (slug: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-sm text-slate-400">
        {roadmaps.length} roadmap tersimpan
      </p>
      <Link
        href="/admin/roadmaps"
        className="rounded-xl bg-cyan-600/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
      >
        🗺️ Kelola Roadmaps
      </Link>
    </div>
  );
}

export function ProductTab({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-sm text-slate-400">
        {products.length} produk tersimpan
      </p>
      <Link
        href="/admin/products"
        className="rounded-xl bg-cyan-600/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
      >
        🛒 Kelola Produk
      </Link>
    </div>
  );
}

export function CategoryTab({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <p className="text-sm text-slate-400">
        {categories.length} kategori tersimpan
      </p>
      <Link
        href="/admin/categories"
        className="rounded-xl bg-cyan-600/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-500"
      >
        🏷️ Kelola Kategori
      </Link>
    </div>
  );
}
