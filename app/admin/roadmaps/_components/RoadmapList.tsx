"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Roadmap } from "@/types/roadmaps";

type Props = {
  roadmaps: Roadmap[];
  saving: boolean;
  onEdit: (item: Roadmap) => void;
  onDelete: (slug: string) => void;
};

export function RoadmapList({ roadmaps, saving, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState("");

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

  return (
    <section className="glass-panel rounded-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Daftar Roadmap
        </h2>
        <span
          className="text-xs rounded-full px-2.5 py-1"
          style={{
            background: "var(--input-bg)",
            color: "var(--text-secondary)",
            border: "1px solid var(--input-border)",
          }}
        >
          {filtered.length}/{roadmaps.length} roadmap
        </span>
      </div>

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
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Belum ada roadmap. Tambahkan di atas.
        </p>
      )}

      {roadmaps.length > 0 && filtered.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Tidak ada hasil untuk &ldquo;{search}&rdquo;.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.slug}
            className="group relative flex flex-col overflow-hidden rounded-xl border transition hover:border-cyan-400/40"
            style={{ borderColor: "var(--surface-border)", background: "var(--surface)" }}
          >
            {/* Thumbnail */}
            {item.image && (
              <div className="relative h-28 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="flex flex-1 flex-col gap-2 p-3">
              {/* Title & slug */}
              <div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  /{item.slug}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="roadmap-badge-neutral rounded-full border px-2 py-0.5 text-[11px]">
                  {item.level}
                </span>
                <span className="roadmap-badge-neutral rounded-full border px-2 py-0.5 text-[11px]">
                  {item.duration}
                </span>
                <span className="roadmap-badge-neutral rounded-full border px-2 py-0.5 text-[11px]">
                  {item.steps.length} step
                </span>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="roadmap-tag rounded-full px-2 py-0.5 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                  style={{
                    borderColor: "var(--text-accent)",
                    color: "var(--text-accent)",
                    background: "transparent",
                  }}
                >
                  ✏️ Edit
                </button>
                <Link
                  href={`/roadmap/${item.slug}`}
                  target="_blank"
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                  style={{
                    borderColor: "var(--surface-border)",
                    color: "var(--text-secondary)",
                    background: "transparent",
                  }}
                >
                  👁️
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(item.slug)}
                  disabled={saving}
                  className="rounded-lg border border-rose-500/50 px-3 py-1.5 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 hover:border-rose-400 disabled:opacity-40"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

