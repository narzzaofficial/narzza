"use client";

import Link from "next/link";
import { useRoadmapList } from "@/hooks/useRoadmapsList";
import { RoadmapList } from "../_components/RoadmapList";

export default function RoadmapAdminPage() {
  const { roadmaps, loading, error, handleDelete } = useRoadmapList();

  return (
    <div
      className="min-h-screen px-4 py-6"
      style={{ background: "var(--background)", color: "var(--text-primary)" }}
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* Breadcrumb */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 mb-6"
          style={{ color: "var(--text-accent)" }}
        >
          Kembali ke Admin
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--text-accent)" }}
            >
              Admin
            </p>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Roadmaps
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {roadmaps.length} roadmap tersimpan
            </p>
          </div>
          <Link
            href="/admin/roadmaps/new"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "var(--text-accent)" }}
          >
            + Tambah Roadmap
          </Link>
        </div>

        {/* States */}
        {loading && (
          <p
            className="text-sm py-8 text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            Memuat...
          </p>
        )}

        {error && <p className="text-sm text-rose-400 mb-4">{error}</p>}

        {/* List */}
        {!loading && (
          <RoadmapList roadmaps={roadmaps} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
