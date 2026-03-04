"use client";

import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/types/roadmaps";
import { ImageUpload } from "@/components/ImageUpload";

type Props = {
  form: Roadmap;
  editingSlug: string | null;
  saving: boolean;
  hasChanges: boolean;
  error: string | null;
  message: string | null;
  setForm: React.Dispatch<React.SetStateAction<Roadmap>>;
  onSave: () => void;
  onReset: () => void;
  onAddStep: () => void;
  onRemoveStep: (i: number) => void;
  onUpdateStep: (i: number, field: keyof RoadmapStep, value: string) => void;
  onAddVideo: (si: number) => void;
  onRemoveVideo: (si: number, vi: number) => void;
  onUpdateVideo: (si: number, vi: number, field: keyof RoadmapVideo, value: string) => void;
  onShowJsonModal: () => void;
};

const inputCls =
  "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400/70";
const inputStyle = {
  background: "var(--input-bg)",
  borderColor: "var(--input-border)",
  color: "var(--text-primary)",
};
const labelCls = "text-xs";
const labelStyle = { color: "var(--text-secondary)" };

export function RoadmapForm({
  form,
  editingSlug,
  saving,
  hasChanges,
  error,
  message,
  setForm,
  onSave,
  onReset,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
  onAddVideo,
  onRemoveVideo,
  onUpdateVideo,
  onShowJsonModal,
}: Props) {
  return (
    <section className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          {editingSlug ? "Edit Roadmap" : "Tambah Roadmap"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-80"
            style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text-primary)" }}
            onClick={onShowJsonModal}
          >
            + Import JSON
          </button>
          {editingSlug && (
            <button
              type="button"
              className="text-sm hover:opacity-80"
              style={{ color: "var(--text-accent)" }}
              onClick={onReset}
            >
              + Baru
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-3 text-sm">
        {/* Title */}
        <label className="block">
          <span className={labelCls} style={labelStyle}>Title</span>
          <input
            className={inputCls}
            style={inputStyle}
            value={form.title}
            onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
            placeholder="Judul"
          />
        </label>

        {/* Slug */}
        <label className="block">
          <span className={labelCls} style={labelStyle}>
            Slug (opsional, auto dari title)
          </span>
          <input
            className={inputCls}
            style={inputStyle}
            value={form.slug}
            onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))}
            placeholder="react-specialist"
            disabled={!!editingSlug}
          />
        </label>

        {/* Summary */}
        <label className="block">
          <span className={labelCls} style={labelStyle}>Ringkasan</span>
          <textarea
            className={inputCls}
            style={inputStyle}
            rows={3}
            value={form.summary}
            onChange={(e) => setForm((v) => ({ ...v, summary: e.target.value }))}
          />
        </label>

        {/* Level + Duration */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={labelCls} style={labelStyle}>Level</span>
            <select
              className={inputCls}
              style={inputStyle}
              value={form.level}
              onChange={(e) =>
                setForm((v) => ({ ...v, level: e.target.value as Roadmap["level"] }))
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
              onChange={(e) => setForm((v) => ({ ...v, duration: e.target.value }))}
              placeholder="4-6 minggu"
            />
          </label>
        </div>

        {/* Tags */}
        <label className="block">
          <span className={labelCls} style={labelStyle}>Tags (pisahkan koma)</span>
          <input
            className={inputCls}
            style={inputStyle}
            value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
            onChange={(e) => {
              const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
              setForm((v) => ({ ...v, tags }));
            }}
            placeholder="React, Hooks, State"
          />
        </label>

        {/* Image */}
        <div className="block">
          <span className={labelCls} style={labelStyle}>Image (hero)</span>
          <div className="mt-1">
            <ImageUpload
              currentImageUrl={form.image}
              onUploadComplete={(url) => setForm((v) => ({ ...v, image: url }))}
              label=""
              buttonText="Upload Gambar"
            />
          </div>
          <input
            className={inputCls + " mt-2"}
            style={inputStyle}
            value={form.image}
            onChange={(e) => setForm((v) => ({ ...v, image: e.target.value }))}
            placeholder="Atau masukkan URL manual: https://..."
          />
        </div>

        {/* Steps */}
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
              onClick={onAddStep}
            >
              + Tambah Step
            </button>
          </div>

          {form.steps.length === 0 && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Belum ada langkah. Klik tombol di atas untuk menambah.
            </p>
          )}

          {form.steps.map((step, si) => (
            <div
              key={si}
              className="space-y-3 rounded-lg border p-3"
              style={{ borderColor: "var(--surface-border)", background: "var(--surface)" }}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold" style={{ color: "var(--text-accent)" }}>
                  Step {si + 1}
                </h4>
                <button
                  type="button"
                  className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-400 hover:border-rose-400 hover:bg-rose-500/10"
                  onClick={() => onRemoveStep(si)}
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
                  onChange={(e) => onUpdateStep(si, "title", e.target.value)}
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
                  onChange={(e) => onUpdateStep(si, "description", e.target.value)}
                  placeholder="Dalami props, composition, custom hooks..."
                />
              </label>

              <label className="block">
                <span className={labelCls} style={labelStyle}>Focus (label singkat)</span>
                <input
                  className={inputCls}
                  style={inputStyle}
                  value={step.focus}
                  onChange={(e) => onUpdateStep(si, "focus", e.target.value)}
                  placeholder="Komposisi komponen"
                />
              </label>

              {/* Videos */}
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
                    onClick={() => onAddVideo(si)}
                  >
                    + Video
                  </button>
                </div>

                {step.videos.length === 0 && (
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Belum ada video.
                  </p>
                )}

                {step.videos.map((video, vi) => (
                  <div key={vi} className="flex gap-2">
                    <input
                      className="flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-cyan-400/70"
                      style={inputStyle}
                      value={video.id}
                      onChange={(e) => onUpdateVideo(si, vi, "id", e.target.value)}
                      placeholder="URL YouTube atau Video ID"
                    />
                    <input
                      className="flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-cyan-400/70"
                      style={inputStyle}
                      value={video.author}
                      onChange={(e) => onUpdateVideo(si, vi, "author", e.target.value)}
                      placeholder="Nama author"
                    />
                    <button
                      type="button"
                      className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-400 hover:border-rose-400 hover:bg-rose-500/10"
                      onClick={() => onRemoveVideo(si, vi)}
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
            onClick={onSave}
            disabled={saving || (!editingSlug && !hasChanges)}
          >
            {saving ? "Menyimpan..." : editingSlug ? "Simpan perubahan" : "Tambah"}
          </button>
          <button
            type="button"
            className="rounded-lg border px-4 py-2 text-sm hover:opacity-80 transition"
            style={{ borderColor: "var(--input-border)", color: "var(--text-primary)" }}
            onClick={onReset}
            disabled={saving}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

