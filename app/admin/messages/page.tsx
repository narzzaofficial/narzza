"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { Message, MessageStatus, MessageType } from "@/types/messages";
import { fetchMessages, updateMessageStatus, deleteMessage } from "@/lib/api/messages";
import { RelativeTime } from "@/components/relative-time";

const TYPE_LABEL: Record<MessageType, string> = {
  bug: "🐛 Bug",
  suggestion: "💡 Saran",
};

const STATUS_COLORS: Record<MessageStatus, string> = {
  unread: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  read: "text-slate-400 bg-slate-400/10 border-slate-400/30",
  archived: "text-slate-600 bg-slate-600/10 border-slate-600/30",
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<MessageType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<MessageStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [flash, setFlash] = useState("");

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (filterType !== "all" && m.type !== filterType) return false;
      if (filterStatus !== "all" && m.status !== filterStatus) return false;
      return true;
    });
  }, [messages, filterType, filterStatus]);

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  const handleStatus = async (id: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    try {
      await updateMessageStatus(id, status);
      showFlash(`✅ Status diubah ke "${status}"`);
    } catch {
      load(); // revert
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteMessage(id);
      showFlash("✅ Pesan dihapus");
      if (expanded === id) setExpanded(null);
    } catch {
      load(); // revert
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((v) => (v === id ? null : id));
    // mark as read when opened
    const msg = messages.find((m) => m.id === id);
    if (msg && msg.status === "unread") handleStatus(id, "read");
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-accent)" }}>Admin</p>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Pesan & Feedback
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-xs font-bold text-amber-400">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Laporan bug & rekomendasi konten dari pengguna.
            </p>
          </div>
          <button
            onClick={load}
            className="rounded-xl border px-4 py-2 text-sm transition hover:opacity-80"
            style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
          >
            ↺ Refresh
          </button>
        </div>

        {flash && (
          <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300">
            {flash}
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(["all", "bug", "suggestion"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                filterType === t
                  ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300"
                  : "border-slate-600/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "all" ? "Semua Tipe" : TYPE_LABEL[t]}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {(["all", "unread", "read", "archived"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition capitalize ${
                  filterStatus === s
                    ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300"
                    : "border-slate-600/50 text-slate-400 hover:text-slate-200"
                }`}
              >
                {s === "all" ? "Semua Status" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Message list */}
        {loading && (
          <div className="glass-panel rounded-2xl p-8 text-center" style={{ color: "var(--text-secondary)" }}>
            Memuat pesan...
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="glass-panel rounded-2xl p-8 text-center" style={{ color: "var(--text-secondary)" }}>
            Tidak ada pesan.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`glass-panel rounded-2xl border transition ${
                msg.status === "unread" ? "border-amber-400/20" : "border-transparent"
              }`}
              style={{ background: "var(--surface)" }}
            >
              {/* Row header */}
              <button
                type="button"
                onClick={() => toggleExpand(msg.id)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                {/* Type badge */}
                <span className="mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold" style={{
                  background: msg.type === "bug" ? "rgba(239,68,68,0.1)" : "rgba(6,182,212,0.1)",
                  color: msg.type === "bug" ? "#f87171" : "var(--text-accent)",
                  border: `1px solid ${msg.type === "bug" ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)"}`,
                }}>
                  {TYPE_LABEL[msg.type]}
                </span>

                {/* Summary */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {msg.title || msg.message.slice(0, 60) + (msg.message.length > 60 ? "…" : "")}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[msg.status]}`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {msg.name || "Anonim"} · <RelativeTime timestamp={msg.createdAt} />
                    {msg.contentType && ` · ${msg.contentType}`}
                  </p>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  className={`h-4 w-4 shrink-0 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`}
                  style={{ color: "var(--text-secondary)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Expanded body */}
              {expanded === msg.id && (
                <div
                  className="border-t px-4 py-4 flex flex-col gap-4"
                  style={{ borderColor: "var(--surface-border)" }}
                >
                  {/* Full message */}
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Pesan</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
                      {msg.message}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {msg.email && (
                      <div>
                        <span style={{ color: "var(--text-secondary)" }}>Email: </span>
                        <a href={`mailto:${msg.email}`} className="text-cyan-400 hover:underline">{msg.email}</a>
                      </div>
                    )}
                    {msg.pageUrl && (
                      <div className="truncate">
                        <span style={{ color: "var(--text-secondary)" }}>Halaman: </span>
                        <a href={msg.pageUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline truncate">
                          {msg.pageUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {msg.status !== "read" && (
                      <button onClick={() => handleStatus(msg.id, "read")}
                        className="rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs hover:bg-white/5 transition"
                        style={{ color: "var(--text-secondary)" }}>
                        ✓ Tandai Sudah Dibaca
                      </button>
                    )}
                    {msg.status !== "archived" && (
                      <button onClick={() => handleStatus(msg.id, "archived")}
                        className="rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs hover:bg-white/5 transition"
                        style={{ color: "var(--text-secondary)" }}>
                        📁 Arsipkan
                      </button>
                    )}
                    {msg.status === "archived" && (
                      <button onClick={() => handleStatus(msg.id, "unread")}
                        className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10 transition">
                        ↩ Kembalikan
                      </button>
                    )}
                    <button onClick={() => handleDelete(msg.id)}
                      className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition ml-auto">
                      🗑 Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

