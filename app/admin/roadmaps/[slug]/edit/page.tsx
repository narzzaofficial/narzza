"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRoadmapForm } from "@/hooks/useRoadmapForm";
import { RoadmapFormFields } from "@/app/admin/_components/RoadmapForm";
import { fetchRoadmapBySlug } from "@/lib/api/roadmaps";
import type { Roadmap } from "@/types/roadmaps";

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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-rose-400">{loadError}</p>
        <Link
          href="/admin/roadmaps"
          style={{ color: "var(--text-accent)" }}
          className="text-sm hover:opacity-80"
        >
          Kembali ke Roadmaps
        </Link>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center py-20">
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
    <>
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
    </>
  );
}
