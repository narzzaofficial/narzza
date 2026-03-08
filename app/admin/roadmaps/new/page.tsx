"use client";

import Link from "next/link";
import { useState } from "react";
import { useRoadmapForm } from "@/hooks/useRoadmapForm";

import { JsonImportModal } from "@/components/JsonImportModal";
import { createRoadmap } from "@/lib/api/roadmaps";
import { useRouter } from "next/navigation";
import type { Roadmap } from "@/types/roadmaps";
import { RoadmapFormFields } from "../../_components/RoadmapForm";

const ROADMAP_SCHEMA = `[
  {
    "slug": "react-specialist",
    "title": "React Specialist",
    "summary": "Deskripsi singkat roadmap...",
    "duration": "3-6 bulan",
    "level": "Pemula",
    "tags": ["React", "JavaScript"],
    "image": "https://...",
    "steps": [
      {
        "title": "Dasar React",
        "description": "Belajar JSX, props, state...",
        "focus": "Komponen dasar",
        "videos": [
          { "id": "VIDEO_ID_YOUTUBE", "title": "Judul Video", "author": "Nama Channel" }
        ]
      }
    ]
  }
]`;

export default function NewRoadmapPage() {
  const router = useRouter();
  const [showJsonModal, setShowJsonModal] = useState(false);
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
  } = useRoadmapForm("create");

  const handleJsonImport = async (items: unknown[]): Promise<string | null> => {
    let failCount = 0;
    for (const item of items) {
      try {
        await createRoadmap(item as Roadmap);
      } catch {
        failCount++;
      }
    }
    if (failCount > 0)
      return `${failCount} dari ${items.length} roadmap gagal disimpan.`;
    router.push("/admin/roadmaps");
    router.refresh();
    return null;
  };

  return (
    <div
      className="min-h-screen px-4 py-6"
      style={{ background: "var(--background)", color: "var(--text-primary)" }}
    >
      {showJsonModal && (
        <JsonImportModal
          title="Roadmap"
          schemaHint={ROADMAP_SCHEMA}
          onImport={handleJsonImport}
          onClose={() => setShowJsonModal(false)}
        />
      )}

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
          <span>Tambah</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Tambah Roadmap
          </h1>
          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--input-border)",
              color: "var(--text-primary)",
            }}
          >
            + Import JSON
          </button>
        </div>

        {/* Form */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6">
          <RoadmapFormFields
            form={form}
            setForm={setForm}
            editingSlug={null}
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
              {saving ? "Menyimpan..." : "Simpan Roadmap"}
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
