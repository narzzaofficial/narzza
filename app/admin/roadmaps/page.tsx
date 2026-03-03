"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/types/roadmaps";
import { ImageUpload } from "@/components/ImageUpload";
import { JsonImportModal } from "@/components/JsonImportModal";

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

const emptyForm: Roadmap = {
  slug: "",
  title: "",
  summary: "",
  duration: "",
  level: "Pemula",
  tags: [],
  image: "",
  steps: [],
};

const emptyStep: RoadmapStep = {
  title: "",
  description: "",
  focus: "",
  videos: [],
};

const emptyVideo: RoadmapVideo = {
  id: "",
  author: "",
};

function RoadmapAdminContent() {
  const searchParams = useSearchParams();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Roadmap>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);

  async function handleJsonImport(items: unknown[]) {
    let failCount = 0;
    for (const item of items) {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) failCount++;
    }
    if (failCount > 0)
      return `${failCount} dari ${items.length} roadmap gagal disimpan.`;
    await loadData();
    setMessage(`✅ ${items.length} Roadmap berhasil diimport!`);
    return null;
  }

  const hasChanges = useMemo(() => {
    return (
      !!form.title ||
      !!form.summary ||
      form.tags.length > 0 ||
      form.steps.length > 0 ||
      !!form.image
    );
  }, [form]);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("/api/roadmaps", { cache: "no-store" });
      const data = await res.json();
      setRoadmaps(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Load roadmap for editing from URL param
  useEffect(() => {
    const editSlug = searchParams.get("edit");
    if (editSlug && roadmaps.length > 0) {
      const roadmapToEdit = roadmaps.find((r) => r.slug === editSlug);
      if (roadmapToEdit) {
        setEditingSlug(roadmapToEdit.slug);
        setForm({ ...roadmapToEdit });
      }
    }
  }, [searchParams, roadmaps]);

  function resetForm() {
    setForm(emptyForm);
    setEditingSlug(null);
    setError(null);
    setMessage(null);
  }

  function startEdit(item: Roadmap) {
    setEditingSlug(item.slug);
    setForm({ ...item });
    setMessage(null);
    setError(null);
  }

  function addStep() {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { ...emptyStep }],
    }));
  }

  function removeStep(index: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  }

  function updateStep(index: number, field: keyof RoadmapStep, value: string) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  }

  function addVideo(stepIndex: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? { ...step, videos: [...step.videos, { ...emptyVideo }] }
          : step
      ),
    }));
  }

  function removeVideo(stepIndex: number, videoIndex: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              videos: step.videos.filter((_, vi) => vi !== videoIndex),
            }
          : step
      ),
    }));
  }

  function updateVideo(
    stepIndex: number,
    videoIndex: number,
    field: keyof RoadmapVideo,
    value: string
  ) {
    // Extract video ID from YouTube URL if needed
    let finalValue = value;
    if (
      (field === "id" && value.includes("youtube.com")) ||
      value.includes("youtu.be")
    ) {
      const urlPatterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      ];
      for (const pattern of urlPatterns) {
        const match = value.match(pattern);
        if (match && match[1]) {
          finalValue = match[1];
          break;
        }
      }
    }

    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              videos: step.videos.map((video, vi) =>
                vi === videoIndex ? { ...video, [field]: finalValue } : video
              ),
            }
          : step
      ),
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...form,
        tags: Array.isArray(form.tags)
          ? form.tags
          : typeof form.tags === "string"
            ? (form.tags as unknown as string)
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        steps: form.steps,
      };

      const method = editingSlug ? "PUT" : "POST";
      const url = editingSlug
        ? `/api/roadmaps/${editingSlug}`
        : "/api/roadmaps";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal menyimpan");
      }

      await loadData();
      setMessage(editingSlug ? "Berhasil diperbarui" : "Berhasil ditambahkan");
      resetForm();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Hapus roadmap ini?")) return;
    try {
      setSaving(true);
      setError(null);
      const res = await fetch(`/api/roadmaps/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal menghapus");
      }
      await loadData();
      if (editingSlug === slug) resetForm();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400/70";
  const inputStyle = {
    background: "var(--input-bg)",
    borderColor: "var(--input-border)",
    color: "var(--text-primary)",
  };
  const labelCls = "text-xs" ;
  const labelStyle = { color: "var(--text-secondary)" };

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
        <div className="mb-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80"
            style={{ color: "var(--text-accent)" }}
          >
            ← Kembali ke Admin
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-accent)" }}>
            Admin
          </p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Roadmaps</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            CRUD sederhana, data tersimpan di MongoDB yang sudah terhubung.
          </p>
        </div>

        {/* ── Form Section ── */}
        <section
          className="glass-panel rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {editingSlug ? "Edit Roadmap" : "Tambah Roadmap"}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-80"
                style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
                onClick={() => setShowJsonModal(true)}
              >
                + Tambah JSON
              </button>
              {editingSlug && (
                <button
                  type="button"
                  className="text-sm hover:opacity-80"
                  style={{ color: "var(--text-accent)" }}
                  onClick={resetForm}
                >
                  + Baru
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-3 text-sm">
            <label className="block">
              <span className={labelCls} style={labelStyle}>Title</span>
              <input
                className={inputCls}
                style={inputStyle}
                value={form.title}
                onChange={(e) =>
                  setForm((v) => ({ ...v, title: e.target.value }))
                }
                placeholder="Judul"
              />
            </label>

            <label className="block">
              <span className={labelCls} style={labelStyle}>
                Slug (opsional, auto dari title)
              </span>
              <input
                className={inputCls}
                style={inputStyle}
                value={form.slug}
                onChange={(e) =>
                  setForm((v) => ({ ...v, slug: e.target.value }))
                }
                placeholder="react-specialist"
                disabled={!!editingSlug}
              />
            </label>

            <label className="block">
              <span className={labelCls} style={labelStyle}>Ringkasan</span>
              <textarea
                className={inputCls}
                style={inputStyle}
                rows={3}
                value={form.summary}
                onChange={(e) =>
                  setForm((v) => ({ ...v, summary: e.target.value }))
                }
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className={labelCls} style={labelStyle}>Level</span>
                <select
                  className={inputCls}
                  style={inputStyle}
                  value={form.level}
                  onChange={(e) =>
                    setForm((v) => ({
                      ...v,
                      level: e.target.value as Roadmap["level"],
                    }))
                  }
                >
                  <option value="Pemula">Pemula</option>
                  <option value="Menengah">Menengah</option>
                  <option value="Lanjutan">Lanjutan</option>
                </select>
              </label>
              <label className="block">
                <span className={labelCls} style={labelStyle}>Durasi</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={form.duration}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, duration: e.target.value }))
                  }
                  placeholder="4-6 minggu"
                />
              </label>
            </div>

            <label className="block">
              <span className={labelCls} style={labelStyle}>
                Tags (pisahkan koma)
              </span>
              <input
                className={inputCls}
                style={inputStyle}
                value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  setForm((v) => ({ ...v, tags }));
                }}
                placeholder="React, Hooks, State"
              />
            </label>

            <div className="block">
              <span className={labelCls} style={labelStyle}>Image (hero)</span>
              <div className="mt-1">
                <ImageUpload
                  currentImageUrl={form.image}
                  onUploadComplete={(url) =>
                    setForm((v) => ({ ...v, image: url }))
                  }
                  label=""
                  buttonText="Upload Gambar"
                />
              </div>
              <input
                className={inputCls + " mt-2"}
                style={inputStyle}
                value={form.image}
                onChange={(e) =>
                  setForm((v) => ({ ...v, image: e.target.value }))
                }
                placeholder="Atau masukkan URL manual: https://..."
              />
            </div>

            <div
              className="space-y-4 rounded-xl border p-4"
              style={{ borderColor: "var(--surface-border)", background: "var(--input-bg)" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Langkah-langkah (Steps)
                </h3>
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  onClick={addStep}
                >
                  + Tambah Step
                </button>
              </div>

              {form.steps.length === 0 && (
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Belum ada langkah. Klik tombol di atas untuk menambah.
                </p>
              )}

              {form.steps.map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  className="space-y-3 rounded-lg border p-3"
                  style={{ borderColor: "var(--surface-border)", background: "var(--surface)" }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold" style={{ color: "var(--text-accent)" }}>
                      Step {stepIndex + 1}
                    </h4>
                    <button
                      type="button"
                      className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-400 hover:border-rose-400 hover:bg-rose-500/10"
                      onClick={() => removeStep(stepIndex)}
                    >
                      Hapus Step
                    </button>
                  </div>

                  <label className="block">
                    <span className={labelCls} style={labelStyle}>Judul Step</span>
                    <input
                      className={inputCls}
                      style={inputStyle}
                      value={step.title}
                      onChange={(e) =>
                        updateStep(stepIndex, "title", e.target.value)
                      }
                      placeholder="Component Patterns & Hooks"
                    />
                  </label>

                  <label className="block">
                    <span className={labelCls} style={labelStyle}>Deskripsi</span>
                    <textarea
                      className={inputCls}
                      style={inputStyle}
                      rows={2}
                      value={step.description}
                      onChange={(e) =>
                        updateStep(stepIndex, "description", e.target.value)
                      }
                      placeholder="Dalami props, composition, custom hooks..."
                    />
                  </label>

                  <label className="block">
                    <span className={labelCls} style={labelStyle}>
                      Focus (label singkat)
                    </span>
                    <input
                      className={inputCls}
                      style={inputStyle}
                      value={step.focus}
                      onChange={(e) =>
                        updateStep(stepIndex, "focus", e.target.value)
                      }
                      placeholder="Komposisi komponen"
                    />
                  </label>

                  <div
                    className="space-y-2 rounded-lg border p-3"
                    style={{ borderColor: "var(--input-border)", background: "var(--input-bg)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        Video YouTube
                      </span>
                      <button
                        type="button"
                        className="rounded-lg bg-cyan-600/70 px-2 py-1 text-xs text-white hover:bg-cyan-500"
                        onClick={() => addVideo(stepIndex)}
                      >
                        + Video
                      </button>
                    </div>

                    {step.videos.length === 0 && (
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Belum ada video.</p>
                    )}

                    {step.videos.map((video, videoIndex) => (
                      <div key={videoIndex} className="flex gap-2">
                        <input
                          className="flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-cyan-400/70"
                          style={inputStyle}
                          value={video.id}
                          onChange={(e) =>
                            updateVideo(
                              stepIndex,
                              videoIndex,
                              "id",
                              e.target.value
                            )
                          }
                          placeholder="URL YouTube atau Video ID"
                        />
                        <input
                          className="flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-cyan-400/70"
                          style={inputStyle}
                          value={video.author}
                          onChange={(e) =>
                            updateVideo(
                              stepIndex,
                              videoIndex,
                              "author",
                              e.target.value
                            )
                          }
                          placeholder="Nama author"
                        />
                        <button
                          type="button"
                          className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-400 hover:border-rose-400 hover:bg-rose-500/10"
                          onClick={() => removeVideo(stepIndex, videoIndex)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
                onClick={handleSave}
                disabled={saving || (!editingSlug && !hasChanges)}
              >
                {saving
                  ? "Menyimpan..."
                  : editingSlug
                    ? "Simpan perubahan"
                    : "Tambah"}
              </button>
              <button
                type="button"
                className="rounded-lg border px-4 py-2 text-sm hover:opacity-80 transition"
                style={{ borderColor: "var(--input-border)", color: "var(--text-primary)" }}
                onClick={resetForm}
                disabled={saving}
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* ── Roadmap List ── */}
        <section className="glass-panel rounded-2xl p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Daftar Roadmap
            </h2>
            <span className="text-xs rounded-full px-2.5 py-1" style={{ background: "var(--input-bg)", color: "var(--text-secondary)", border: "1px solid var(--input-border)" }}>
              {roadmaps.length} roadmap
            </span>
          </div>

          {loading && (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Memuat...</p>
          )}

          {!loading && roadmaps.length === 0 && (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Belum ada roadmap. Tambahkan di atas.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((item) => (
              <div
                key={item.slug}
                className="group relative flex flex-col overflow-hidden rounded-xl border transition hover:border-cyan-400/40"
                style={{
                  borderColor: "var(--surface-border)",
                  background: "var(--surface)",
                }}
              >
                {/* Image */}
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

                  {/* Action buttons */}
                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                      style={{
                        borderColor: "var(--text-accent)",
                        color: "var(--text-accent)",
                        background: "transparent",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.slug)}
                      disabled={saving}
                      className="rounded-lg border border-rose-500/50 px-3 py-1.5 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 hover:border-rose-400 disabled:opacity-40"
                    >
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
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
