"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/lib/api/messages";
import type { MessageCreatePayload } from "@/types/messages";

const CONTENT_TYPES = [
  { value: "Artikel", icon: "📰" },
  { value: "Tutorial", icon: "🎓" },
  { value: "Riset", icon: "🔬" },
  { value: "Buku", icon: "📚" },
  { value: "Roadmap", icon: "🗺️" },
  { value: "Produk", icon: "🛒" },
  { value: "Lainnya", icon: "💬" },
] as const;
type ContentType = (typeof CONTENT_TYPES)[number]["value"];

const fieldCls = "w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-cyan-400/60";
const fieldStyle = { background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text-primary)" };
const labelStyle = { color: "var(--text-secondary)" };

export default function RekomendasikanPage() {
  const router = useRouter();
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
    if (!form.message.trim()) { setError("Deskripsi rekomendasi tidak boleh kosong."); return; }
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim rekomendasi.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full text-4xl" style={{ border: "1px solid rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.1)" }}>
          💡
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Rekomendasi Terkirim!</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Terima kasih! Kami akan mempertimbangkan idemu untuk konten berikutnya.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-6 py-2.5 text-sm transition"
          style={{ border: "1px solid var(--input-border)", background: "var(--input-bg)", color: "var(--text-secondary)" }}
        >
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-60" style={{ background: "linear-gradient(to bottom right, rgba(6,182,212,0.1), rgba(37,99,235,0.1))" }} />
        <div className="relative">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 flex items-center gap-2 text-xs font-medium transition"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Kembali
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-600/20 text-2xl" style={{ border: "1px solid rgba(6,182,212,0.4)" }}>
              💡
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-accent)" }}>Content Suggestion</p>
              <h1 className="mt-0.5 text-2xl font-bold md:text-3xl" style={{ color: "var(--text-primary)" }}>Rekomendasikan Konten</h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-sm" style={{ color: "var(--text-secondary)" }}>
            Ada topik yang ingin kamu lihat di Narzza? Rekomendasimu sangat berharga bagi komunitas.
          </p>
        </div>
      </header>

      <form onSubmit={submit} className="space-y-4">
        <section className="glass-panel rounded-2xl p-5 ring-1 ring-white/5">
          <div className="space-y-4">
            {/* Content Type */}
            <label className="block">
              <span className="mb-1.5 block text-xs" style={labelStyle}>Tipe Konten</span>
              <select className={fieldCls} style={fieldStyle} value={form.contentType} onChange={handle("contentType")}>
                {CONTENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.value}</option>
                ))}
              </select>
            </label>

            {/* Identity */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs" style={labelStyle}>Nama (opsional)</span>
                <input className={fieldCls} style={fieldStyle} value={form.name} onChange={handle("name")} placeholder="Nama kamu" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs" style={labelStyle}>Email (opsional)</span>
                <input type="email" className={fieldCls} style={fieldStyle} value={form.email} onChange={handle("email")} placeholder="email@contoh.com" />
              </label>
            </div>

            {/* Title */}
            <label className="block">
              <span className="mb-1.5 block text-xs" style={labelStyle}>Judul / Topik (opsional)</span>
              <input className={fieldCls} style={fieldStyle} value={form.title} onChange={handle("title")} placeholder="cth. Panduan Next.js App Router untuk Pemula" />
            </label>

            {/* Description */}
            <label className="block">
              <span className="mb-1.5 block text-xs" style={labelStyle}>
                Deskripsi <span className="text-rose-400">*</span>
              </span>
              <textarea
                className={fieldCls}
                style={fieldStyle}
                rows={5}
                value={form.message}
                onChange={handle("message")}
                placeholder="Ceritakan konten yang ingin kamu lihat. Kenapa topik ini penting?"
                required
              />
            </label>
          </div>
        </section>

        {error && (
          <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-cyan-600 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "💡 Kirim Rekomendasi"}
        </button>
      </form>
    </div>
  );
}
