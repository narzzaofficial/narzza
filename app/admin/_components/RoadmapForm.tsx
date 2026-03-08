"use client";

import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/types/roadmaps";
import { ImageUpload } from "@/components/ImageUpload";

type Props = {
  form: Roadmap;
  editingSlug: string | null;
  setForm: React.Dispatch<React.SetStateAction<Roadmap>>;
  onAddStep: () => void;
  onRemoveStep: (i: number) => void;
  onUpdateStep: (i: number, field: keyof RoadmapStep, value: string) => void;
  onAddVideo: (si: number) => void;
  onRemoveVideo: (si: number, vi: number) => void;
  onUpdateVideo: (
    si: number,
    vi: number,
    field: keyof RoadmapVideo,
    value: string
  ) => void;
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

export function RoadmapFormFields({
  form,
  editingSlug,
  setForm,
  onAddStep,
  onRemoveStep,
  onUpdateStep,
  onAddVideo,
  onRemoveVideo,
  onUpdateVideo,
}: Props) {
  return (
    <div className="space-y-4 text-sm">
      {/* Title */}
      <label className="block">
        <span className={labelCls} style={labelStyle}>
          Title *
        </span>
        <input
          className={inputCls}
          style={inputStyle}
          value={form.title}
          onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
          placeholder="Judul roadmap"
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
        <span className={labelCls} style={labelStyle}>
          Ringkasan
        </span>
        <textarea
          className={inputCls}
          style={inputStyle}
          rows={3}
          value={form.summary}
          onChange={(e) => setForm((v) => ({ ...v, summary: e.target.value }))}
          placeholder="Deskripsi singkat roadmap..."
        />
      </label>

      {/* Level + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls} style={labelStyle}>
            Level
          </span>
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
          <span className={labelCls} style={labelStyle}>
            Durasi
          </span>
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

      {/* Tags */}
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

      {/* Image */}
      <div>
        <span className={labelCls} style={labelStyle}>
          Image (hero)
        </span>
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
        style={{
          borderColor: "var(--surface-border)",
          background: "var(--input-bg)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Langkah-langkah ({form.steps.length} step)
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
            style={{
              borderColor: "var(--surface-border)",
              background: "var(--surface)",
            }}
          >
            <div className="flex items-center justify-between">
              <h4
                className="text-xs font-semibold"
                style={{ color: "var(--text-accent)" }}
              >
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
              <span className={labelCls} style={labelStyle}>
                Judul Step
              </span>
              <input
                className={inputCls}
                style={inputStyle}
                value={step.title}
                onChange={(e) => onUpdateStep(si, "title", e.target.value)}
                placeholder="Component Patterns & Hooks"
              />
            </label>

            <label className="block">
              <span className={labelCls} style={labelStyle}>
                Deskripsi
              </span>
              <textarea
                className={inputCls}
                style={inputStyle}
                rows={2}
                value={step.description}
                onChange={(e) =>
                  onUpdateStep(si, "description", e.target.value)
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
                onChange={(e) => onUpdateStep(si, "focus", e.target.value)}
                placeholder="Komposisi komponen"
              />
            </label>

            {/* Videos */}
            <div
              className="space-y-2 rounded-lg border p-3"
              style={{
                borderColor: "var(--input-border)",
                background: "var(--input-bg)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
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
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Belum ada video.
                </p>
              )}

              {step.videos.map((video, vi) => (
                <div key={vi} className="space-y-1.5">
                  <div className="flex flex-wrap gap-2">
                    <input
                      className="flex-1 min-w-[180px] rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-cyan-400/70"
                      style={inputStyle}
                      value={video.id}
                      onChange={(e) =>
                        onUpdateVideo(si, vi, "id", e.target.value)
                      }
                      placeholder="YouTube ID atau URL"
                    />
                    <input
                      className="flex-1 min-w-[140px] rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-cyan-400/70"
                      style={inputStyle}
                      value={video.author}
                      onChange={(e) =>
                        onUpdateVideo(si, vi, "author", e.target.value)
                      }
                      placeholder="Nama channel"
                    />
                    <button
                      type="button"
                      className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-400 hover:border-rose-400 hover:bg-rose-500/10"
                      onClick={() => onRemoveVideo(si, vi)}
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    className="w-full rounded-lg border px-2 py-1.5 text-xs outline-none focus:border-cyan-400/70"
                    style={inputStyle}
                    value={video.title ?? ""}
                    onChange={(e) =>
                      onUpdateVideo(si, vi, "title", e.target.value)
                    }
                    placeholder="Judul video (contoh: Belajar HTML dari Nol)"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
