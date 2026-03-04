"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/api/messages";
import type { MessageCreatePayload } from "@/types/messages";

/* ── Shared field styles ──────────────────────────────────────────── */
const fieldCls = "w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-cyan-400/60 transition";
const fieldStyle = {
  background: "var(--input-bg)",
  borderColor: "var(--input-border)",
  color: "var(--text-primary)",
};
const labelCls = "block text-xs mb-1";
const labelStyle = { color: "var(--text-secondary)" };

/* ── Bug Report Form ─────────────────────────────────────────────── */
export function BugReportForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.message.trim()) {
      setError("Deskripsi bug tidak boleh kosong.");
      return;
    }
    setLoading(true);
    try {
      const payload: MessageCreatePayload = {
        type: "bug",
        name: form.name,
        email: form.email,
        message: form.message,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      };
      await sendMessage(payload);
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim laporan.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="text-3xl">✅</span>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Laporan terkirim!
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Terima kasih, kami akan segera memeriksa masalah ini.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className={labelCls} style={labelStyle}>Nama (opsional)</span>
          <input className={fieldCls} style={fieldStyle} value={form.name} onChange={handle("name")} placeholder="Nama kamu" />
        </label>
        <label className="block">
          <span className={labelCls} style={labelStyle}>Email (opsional)</span>
          <input className={fieldCls} style={fieldStyle} type="email" value={form.email} onChange={handle("email")} placeholder="email@..." />
        </label>
      </div>

      <label className="block">
        <span className={labelCls} style={labelStyle}>
          Deskripsi bug <span className="text-rose-400">*</span>
        </span>
        <textarea
          className={fieldCls}
          style={fieldStyle}
          rows={4}
          value={form.message}
          onChange={handle("message")}
          placeholder="Ceritakan bug yang kamu temukan, langkah untuk mereproduksi, dan perilaku yang diharapkan..."
          required
        />
      </label>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-rose-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
      >
        {loading ? "Mengirim..." : "🐛 Kirim Laporan"}
      </button>
    </form>
  );
}

/* ── Content Suggestion Form ─────────────────────────────────────── */
const CONTENT_TYPES = ["Artikel", "Tutorial", "Riset", "Buku", "Roadmap", "Produk", "Lainnya"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

export function SuggestionForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contentType: "Artikel" as ContentType,
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.message.trim()) {
      setError("Deskripsi rekomendasi tidak boleh kosong.");
      return;
    }
    setLoading(true);
    try {
      const payload: MessageCreatePayload = {
        type: "suggestion",
        name: form.name,
        email: form.email,
        message: form.message,
        contentType: form.contentType,
        title: form.title,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      };
      await sendMessage(payload);
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim rekomendasi.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="text-3xl">💡</span>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Rekomendasi terkirim!
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Terima kasih! Kami akan mempertimbangkan saranmu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className={labelCls} style={labelStyle}>Nama (opsional)</span>
          <input className={fieldCls} style={fieldStyle} value={form.name} onChange={handle("name")} placeholder="Nama kamu" />
        </label>
        <label className="block">
          <span className={labelCls} style={labelStyle}>Email (opsional)</span>
          <input className={fieldCls} style={fieldStyle} type="email" value={form.email} onChange={handle("email")} placeholder="email@..." />
        </label>
      </div>

      <label className="block">
        <span className={labelCls} style={labelStyle}>Tipe Konten</span>
        <select className={fieldCls} style={fieldStyle} value={form.contentType} onChange={handle("contentType")}>
          {CONTENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className={labelCls} style={labelStyle}>Judul / Topik (opsional)</span>
        <input className={fieldCls} style={fieldStyle} value={form.title} onChange={handle("title")} placeholder="e.g. Next.js 15 App Router Deep Dive" />
      </label>

      <label className="block">
        <span className={labelCls} style={labelStyle}>
          Deskripsi <span className="text-rose-400">*</span>
        </span>
        <textarea
          className={fieldCls}
          style={fieldStyle}
          rows={3}
          value={form.message}
          onChange={handle("message")}
          placeholder="Kenapa konten ini perlu dibuat? Siapa yang akan dibantu?"
          required
        />
      </label>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-cyan-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-50"
      >
        {loading ? "Mengirim..." : "💡 Kirim Rekomendasi"}
      </button>
    </form>
  );
}

