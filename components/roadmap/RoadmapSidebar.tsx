"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Roadmap, RoadmapStep } from "@/types/roadmaps";

type ActiveVideo = { stepIndex: number; videoIndex: number };

type RoadmapSidebarProps = {
  roadmap: Roadmap;
  active: ActiveVideo;
  watched: Set<string>;
  onSelect: (si: number, vi: number) => void;
  onClose?: () => void;
};

/* ─── Section Header ──────────────────────────────────────────────── */
function SectionHeader({
  step,
  stepNumber,
  videoCount,
  isOpen,
  onToggle,
}: {
  step: RoadmapStep;
  stepNumber: number;
  videoCount: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-white/5"
      style={{ borderBottom: "1px solid var(--surface-border)" }}
    >
      <div className="flex items-start gap-2 min-w-0">
        <div
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
          style={{
            background: "rgba(6,182,212,0.12)",
            color: "var(--text-accent)",
            outline: "1px solid rgba(6,182,212,0.3)",
          }}
        >
          {stepNumber}
        </div>
        <div className="min-w-0">
          <p
            className="text-xs font-bold leading-snug uppercase tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            {step.title}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {videoCount} video
          </p>
        </div>
      </div>
      <span
        className="shrink-0 text-xs transition-transform duration-200"
        style={{
          color: "var(--text-secondary)",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        ▾
      </span>
    </button>
  );
}

/* ─── Video Item ─────────────────────────────────────────────────── */
function VideoItem({
  videoIndex,
  step,
  video,
  isActive,
  isWatched,
  onClick,
}: {
  videoIndex: number;
  step: RoadmapStep;
  video: { id: string; author: string };
  isActive: boolean;
  isWatched: boolean;
  globalIndex?: number; // kept for compat, unused
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full px-4 py-3 text-left transition-colors"
      style={{
        background: isActive ? "rgba(6,182,212,0.08)" : "transparent",
        borderLeft: isActive
          ? "3px solid var(--text-accent)"
          : "3px solid transparent",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Watched / active dot */}
        <div
          className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors"
          style={{
            background: isWatched
              ? "rgba(16,185,129,0.18)"
              : isActive
                ? "rgba(6,182,212,0.18)"
                : "rgba(100,116,139,0.12)",
            color: isWatched
              ? "#6ee7b7"
              : isActive
                ? "var(--text-accent)"
                : "var(--text-secondary)",
          }}
        >
          {isWatched ? "✓" : "▶"}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-snug truncate"
            style={{
              color: isActive ? "var(--text-accent)" : "var(--text-primary)",
            }}
          >
            {step.title}
          </p>
          <p
            className="mt-0.5 text-xs truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            Video {videoIndex + 1} • {video.author}
          </p>
        </div>

        {/* Playing indicator bars */}
        {isActive && (
          <div className="mt-1 flex shrink-0 items-end gap-0.5 h-3.5">
            <span
              className="w-0.5 rounded-full"
              style={{
                height: "40%",
                background: "var(--text-accent)",
                animation: "equalizer 0.8s ease-in-out infinite",
              }}
            />
            <span
              className="w-0.5 rounded-full"
              style={{
                height: "100%",
                background: "var(--text-accent)",
                animation: "equalizer 0.8s ease-in-out 0.2s infinite",
              }}
            />
            <span
              className="w-0.5 rounded-full"
              style={{
                height: "60%",
                background: "var(--text-accent)",
                animation: "equalizer 0.8s ease-in-out 0.4s infinite",
              }}
            />
          </div>
        )}
      </div>
    </button>
  );
}

/* ─── Main Sidebar ──────────────────────────────────────────────── */
export function RoadmapSidebar({
  roadmap,
  active,
  watched,
  onSelect,
  onClose,
}: RoadmapSidebarProps) {
  // track which sections are open (all open by default)
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set(roadmap.steps.map((_, i) => i))
  );

  const toggleSection = (i: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const totalVids = roadmap.steps.reduce((sum, s) => sum + s.videos.length, 0);

  return (
    <aside
      className="flex flex-col"
      style={{
        height: "100%",
        background: "var(--surface)",
      }}
    >
      {/* Sidebar header */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{ borderColor: "var(--surface-border)", background: "var(--surface)" }}
      >
        {/* Title row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/roadmap"
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold tracking-wide transition hover:opacity-80 active:scale-95"
            style={{
              background: "rgba(6,182,212,0.12)",
              color: "var(--text-accent)",
              border: "1.5px solid rgba(6,182,212,0.35)",
              letterSpacing: "0.04em",
            }}
            title="Kembali ke Roadmap"
          >
            Roadmap
          </Link>
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              Kurikulum
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {roadmap.steps.length} bagian • {totalVids} video
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable section list */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {roadmap.steps.map((step, si) => (
          <div key={`${step.title}-${si}`}>
            <SectionHeader
              step={step}
              stepNumber={si + 1}
              videoCount={step.videos.length}
              isOpen={openSections.has(si)}
              onToggle={() => toggleSection(si)}
            />

            {openSections.has(si) && (
              <div>
                {step.videos.map((video, vi) => {
                  return (
                    <VideoItem
                      key={`${si}-${vi}`}
                      videoIndex={vi}
                      step={step}
                      video={video}
                      isActive={active.stepIndex === si && active.videoIndex === vi}
                      isWatched={watched.has(`${si}-${vi}`)}
                      onClick={() => onSelect(si, vi)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
