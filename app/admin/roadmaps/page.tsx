"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useRoadmaps } from "@/hooks/useRoadmaps";
import { JsonImportModal } from "@/components/JsonImportModal";
import { RoadmapForm } from "./_components/RoadmapForm";
import { RoadmapList } from "./_components/RoadmapList";

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
          { "id": "VIDEO_ID_YOUTUBE", "author": "Nama Channel" }
        ]
      }
    ]
  }
]`;

function RoadmapAdminContent() {
  const searchParams = useSearchParams();
  const [showJsonModal, setShowJsonModal] = useState(false);

  const {
    roadmaps,
    loading,
    saving,
    error,
    message,
    form,
    editingSlug,
    hasChanges,
    setForm,
    resetForm,
    startEdit,
    addStep,
    removeStep,
    updateStep,
    addVideo,
    removeVideo,
    updateVideo,
    handleSave,
    handleDelete,
    handleJsonImport,
  } = useRoadmaps();

  // Auto-load edit form from ?edit=slug URL param
  useEffect(() => {
    const editSlug = searchParams.get("edit");
    if (editSlug && roadmaps.length > 0) {
      const found = roadmaps.find((r) => r.slug === editSlug);
      if (found) startEdit(found);
    }
  }, [searchParams, roadmaps, startEdit]);

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

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80"
            style={{ color: "var(--text-accent)" }}
          >
            ← Kembali ke Admin
          </Link>
        </div>

        {/* Page header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-accent)" }}>
            Admin
          </p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Roadmaps
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            CRUD sederhana, data tersimpan di MongoDB yang sudah terhubung.
          </p>
        </div>

        {loading && (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Memuat...
          </p>
        )}

        {/* Form */}
        <RoadmapForm
          form={form}
          editingSlug={editingSlug}
          saving={saving}
          hasChanges={hasChanges}
          error={error}
          message={message}
          setForm={setForm}
          onSave={handleSave}
          onReset={resetForm}
          onAddStep={addStep}
          onRemoveStep={removeStep}
          onUpdateStep={updateStep}
          onAddVideo={addVideo}
          onRemoveVideo={removeVideo}
          onUpdateVideo={updateVideo}
          onShowJsonModal={() => setShowJsonModal(true)}
        />

        {/* List */}
        <RoadmapList
          roadmaps={roadmaps}
          saving={saving}
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default function RoadmapAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400">Loading...</div>
      }
    >
      <RoadmapAdminContent />
    </Suspense>
  );
}
