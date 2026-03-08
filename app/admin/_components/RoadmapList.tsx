"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Roadmap } from "@/types/roadmaps";

type Props = {
  roadmaps: Roadmap[];
  onDelete: (slug: string) => void;
};

export function RoadmapList({ roadmaps, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return roadmaps;
    return roadmaps.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.level.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [roadmaps, search]);

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);
    await onDelete(slug);
    setDeletingSlug(null);
  };

  return (
    <div>
      {/* Search */}
      {roadmaps.length > 0 && (
        <div className="mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, slug, level, atau tag..."
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-cyan-400/70"
            style={{
              background: "var(--input-bg)",
              borderColor: "var(--input-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      )}

      {roadmaps.length === 0 && (
        <p
          className="text-sm py-8 text-center"
          style={{ color: "var(--text-secondary)" }}
        >
          Belum ada roadmap. Klik &ldquo;+ Tambah Roadmap&rdquo; untuk mulai.
        </p>
      )}

      {roadmaps.length > 0 && filtered.length === 0 && (
        <p className="text-sm py-4" style={{ color: "var(--text-secondary)" }}>
          Tidak ada hasil untuk &ldquo;{search}&rdquo;.
        </p>
      )}

      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.slug}
            className="flex items-center gap-3 rounded-xl border px-4 py-3 transition hover:border-cyan-400/30"
            style={{
              borderColor: "var(--surface-border)",
              background: "var(--surface)",
            }}
          >
            {/* Thumbnail */}
            {item.image && (
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span
                  className="text-[11px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  /{item.slug}
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px]"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {item.level}
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px]"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {item.steps.length} step
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 text-[10px]"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {item.duration}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/admin/roadmaps/${item.slug}/edit`}
                className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                style={{
                  borderColor: "var(--text-accent)",
                  color: "var(--text-accent)",
                  background: "transparent",
                }}
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(item.slug)}
                disabled={deletingSlug === item.slug}
                className="rounded-lg border border-rose-500/50 px-3 py-1.5 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 hover:border-rose-400 disabled:opacity-40"
              >
                {deletingSlug === item.slug ? "..." : "Hapus"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
