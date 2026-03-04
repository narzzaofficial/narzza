"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Message, MessageStatus, MessageType } from "@/types/messages";
import { updateMessageStatus, deleteMessage } from "@/lib/api/messages";
import { RelativeTime } from "@/components/relative-time";

const TYPE_LABEL: Record<MessageType, string> = {
  bug: "🐛 Bug",
  suggestion: "💡 Saran",
};

const STATUS_COLORS: Record<MessageStatus, string> = {
  unread: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  read: "text-slate-400 bg-slate-400/10 border-slate-400/30",
  archived: "text-slate-500 bg-slate-500/10 border-slate-500/30",
};

type Props = {
  messages: Message[];
  onRefresh: () => void;
};

export function MessageTab({ messages, onRefresh }: Props) {
  const [filterType, setFilterType] = useState<MessageType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<MessageStatus | "all">("unread");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [flash, setFlash] = useState("");

  // Sync when parent passes fresh data
  useEffect(() => { setLocalMessages(messages); }, [messages]);

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3000);
  };

  const filtered = useMemo(() => {
    return localMessages.filter((m) => {
      if (filterType !== "all" && m.type !== filterType) return false;
      if (filterStatus !== "all" && m.status !== filterStatus) return false;
      return true;
    });
  }, [localMessages, filterType, filterStatus]);

  const unreadCount = localMessages.filter((m) => m.status === "unread").length;

  const handleStatus = useCallback(async (id: string, status: MessageStatus) => {
    // Optimistic
    setLocalMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    try {
      await updateMessageStatus(id, status);
      showFlash(`✅ Status diubah ke "${status}"`);
    } catch {
      onRefresh();
    }
  }, [onRefresh]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    setLocalMessages((prev) => prev.filter((m) => m.id !== id));
    if (expanded === id) setExpanded(null);
    try {
      await deleteMessage(id);
      showFlash("✅ Pesan dihapus");
    } catch {
      onRefresh();
    }
  }, [expanded, onRefresh]);

  const toggleExpand = (id: string) => {
    setExpanded((v) => (v === id ? null : id));
    const msg = localMessages.find((m) => m.id === id);
    if (msg && msg.status === "unread") handleStatus(id, "read");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">
            📨 Pesan & Feedback
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-[11px] font-bold text-amber-400">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">Laporan bug & rekomendasi konten dari pengguna.</p>
        </div>
        <button
          onClick={onRefresh}
          className="rounded-xl border border-slate-600/50 px-3 py-1.5 text-xs text-slate-400 transition hover:text-slate-200"
        >
          ↺ Refresh
        </button>
      </div>

      {flash && (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300">
          {flash}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
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
        <div className="ml-auto flex flex-wrap gap-1.5">
          {(["all", "unread", "read", "archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${
                filterStatus === s
                  ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300"
                  : "border-slate-600/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              {s === "all" ? "Semua" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
          Tidak ada pesan.
        </div>
      )}

      {/* List */}
      {filtered.map((msg) => (
        <div
          key={msg.id}
          className={`glass-panel rounded-2xl border transition ${
            msg.status === "unread" ? "border-amber-400/20" : "border-transparent"
          }`}
        >
          {/* Row */}
          <button
            type="button"
            onClick={() => toggleExpand(msg.id)}
            className="flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left"
          >
            <span
              className="mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-bold"
              style={{
                background: msg.type === "bug" ? "rgba(239,68,68,0.1)" : "rgba(6,182,212,0.1)",
                color: msg.type === "bug" ? "#f87171" : "var(--text-accent)",
                border: `1px solid ${msg.type === "bug" ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)"}`,
              }}
            >
              {TYPE_LABEL[msg.type]}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {msg.title || msg.message.slice(0, 70) + (msg.message.length > 70 ? "…" : "")}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[msg.status]}`}>
                  {msg.status}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                {msg.name || "Anonim"} · <RelativeTime timestamp={msg.createdAt} />
                {msg.contentType ? ` · ${msg.contentType}` : ""}
              </p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={2} stroke="currentColor"
              className={`h-4 w-4 shrink-0 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`}
              style={{ color: "var(--text-secondary)" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {/* Expanded */}
          {expanded === msg.id && (
            <div className="border-t px-4 py-4 flex flex-col gap-3" style={{ borderColor: "var(--surface-border)" }}>
              {/* Message body */}
              <div>
                <p className="text-xs font-semibold mb-1 text-slate-400">Pesan</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
                  {msg.message}
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                {msg.email && (
                  <span>
                    Email:{" "}
                    <a href={`mailto:${msg.email}`} className="text-cyan-400 hover:underline">
                      {msg.email}
                    </a>
                  </span>
                )}
                {msg.pageUrl && (
                  <span className="truncate max-w-xs">
                    Halaman:{" "}
                    <a href={msg.pageUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                      {msg.pageUrl}
                    </a>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-1">
                {msg.status !== "read" && (
                  <button
                    onClick={() => handleStatus(msg.id, "read")}
                    className="rounded-lg border border-slate-600/50 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
                  >
                    ✓ Tandai Sudah Dibaca
                  </button>
                )}
                {msg.status !== "archived" && (
                  <button
                    onClick={() => handleStatus(msg.id, "archived")}
                    className="rounded-lg border border-slate-600/50 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
                  >
                    📁 Arsipkan
                  </button>
                )}
                {msg.status === "archived" && (
                  <button
                    onClick={() => handleStatus(msg.id, "unread")}
                    className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs text-amber-400 transition hover:bg-amber-500/10"
                  >
                    ↩ Kembalikan ke Unread
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="ml-auto rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs text-rose-400 transition hover:bg-rose-500/10"
                >
                  🗑 Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}



