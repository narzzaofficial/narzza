"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRoadmapForm } from "@/hooks/useRoadmapForm";

import { fetchRoadmapBySlug } from "@/lib/api/roadmaps";
import type { Roadmap } from "@/types/roadmaps";
import { RoadmapFormFields } from "../../../_components/RoadmapForm";

export default function EditRoadmapPage() {
  const { slug } = useParams<{ slug: string }>();
  const [initialData, setInitialData] = useState<Roadmap | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmapBySlug(slug)
      .then(setInitialData)
      .catch(() => setLoadError("Roadmap tidak ditemukan"));
  }, [slug]);

  if (loadError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--background)" }}
      >
        <div className="text-center">
          <p className="text-rose-400 mb-4">{loadError}</p>
          <Link
            href="/admin/roadmaps"
            className="text-sm"
            style={{ color: "var(--text-accent)" }}
          >
            ← Kembali ke Roadmaps
          </Link>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Memuat...
        </p>
      </div>
    );
  }

  return <EditForm initialData={initialData} />;
}

function EditForm({ initialData }: { initialData: Roadmap }) {
  const {
    form,
    setForm,
    saving,
    error,
    hasChanges,
    addStep,
    removeStep,
    updateStep,
    addVideo,
    removeVideo,
    updateVideo,
    handleSave,
  } = useRoadmapForm("edit", initialData);

  return (
    <div
      className="min-h-screen px-4 py-6"
      style={{ background: "var(--background)", color: "var(--text-primary)" }}
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 text-sm mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          <Link
            href="/admin"
            className="hover:opacity-80"
            style={{ color: "var(--text-accent)" }}
          >
            Admin
          </Link>
          <span>/</span>
          <Link
            href="/admin/roadmaps"
            className="hover:opacity-80"
            style={{ color: "var(--text-accent)" }}
          >
            Roadmaps
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{initialData.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Edit Roadmap
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              /{initialData.slug}
            </p>
          </div>
          <Link
            href={`/roadmap/${initialData.slug}`}
            target="_blank"
            className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
            style={{
              borderColor: "var(--surface-border)",
              color: "var(--text-secondary)",
            }}
          >
            👁️ Lihat
          </Link>
        </div>

        {/* Form */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6">
          <RoadmapFormFields
            form={form}
            setForm={setForm}
            editingSlug={initialData.slug}
            onAddStep={addStep}
            onRemoveStep={removeStep}
            onUpdateStep={updateStep}
            onAddVideo={addVideo}
            onRemoveVideo={removeVideo}
            onUpdateVideo={updateVideo}
          />

          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="rounded-xl px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--text-accent)" }}
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <Link
              href="/admin/roadmaps"
              className="rounded-xl border px-5 py-2 text-sm font-medium transition hover:opacity-80"
              style={{
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
              }}
            >
              Batal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
