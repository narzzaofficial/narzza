"use client";

import { useState } from "react";
import Link from "next/link";
import type { Roadmap } from "@/types/roadmaps";
import { RoadmapSidebar } from "./RoadmapSidebar";
import { VideoPlayer } from "./VideoPlayer";

type ActiveVideo = { stepIndex: number; videoIndex: number };

export function RoadmapCourseViewer({ roadmap }: { roadmap: Roadmap }) {
  const [active, setActive] = useState<ActiveVideo>({ stepIndex: 0, videoIndex: 0 });
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const markWatched = (si: number, vi: number) =>
    setWatched((prev) => new Set(prev).add(`${si}-${vi}`));

  const handleSelect = (si: number, vi: number) => {
    markWatched(active.stepIndex, active.videoIndex);
    setActive({ stepIndex: si, videoIndex: vi });
  };

  const currentStep = roadmap.steps[active.stepIndex];
  const currentVideo = currentStep?.videos[active.videoIndex];

  if (!currentStep || !currentVideo) {
    return (
      <div
        className="rounded-2xl border p-8 text-center text-sm"
        style={{
          borderColor: "var(--surface-border)",
          color: "var(--text-secondary)",
          background: "var(--surface)",
        }}
      >
        Roadmap ini belum memiliki video materi.
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop layout ───────────────────────────────────────────── */}
      <div className="hidden lg:flex" style={{ background: "var(--background)" }}>

        {/* SIDEBAR — sticky, full viewport height */}
        <div
          className={`shrink-0 transition-all duration-300 overflow-hidden ${
            sidebarOpen ? "w-72 xl:w-80 2xl:w-96" : "w-0"
          }`}
          style={{
            borderRight: sidebarOpen ? "1px solid var(--surface-border)" : "none",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <RoadmapSidebar
            roadmap={roadmap}
            active={active}
            watched={watched}
            onSelect={handleSelect}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* VIDEO AREA */}
        <div className="relative flex flex-1 flex-col min-w-0">

          {/* ── Header — only above the video player ── */}
          <div
            className="flex items-center gap-3 border-b px-4 py-3 sticky top-0 z-40"
            style={{
              borderColor: "var(--surface-border)",
              background: "var(--surface)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Sidebar toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition hover:bg-black/10 dark:hover:bg-white/10"
              style={{
                borderColor: "var(--surface-border)",
                color: "var(--text-secondary)",
              }}
              title={sidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Divider */}
            <div className="h-5 w-px shrink-0" style={{ background: "var(--surface-border)" }} />

            {/* Title + summary */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-sm font-bold leading-tight truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {roadmap.title}
              </h1>
              <p
                className="mt-0.5 text-[11px] truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {roadmap.summary}
              </p>
            </div>

            {/* Tags */}
            <div className="hidden xl:flex shrink-0 items-center gap-1.5 text-[10px] font-medium">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 text-cyan-400">
                {roadmap.level}
              </span>
              <span
                className="rounded-full border px-2.5 py-0.5"
                style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
              >
                {roadmap.duration}
              </span>
              {roadmap.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-0.5"
                  style={{
                    background: "rgba(6,182,212,0.08)",
                    color: "var(--text-accent)",
                    border: "1px solid rgba(6,182,212,0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Player + meta */}
          <VideoPlayer
            video={currentVideo}
            step={currentStep}
            stepIndex={active.stepIndex}
            totalSteps={roadmap.steps.length}
            videoIndex={active.videoIndex}
          />
        </div>
      </div>

      {/* ── Mobile layout ────────────────────────────────────────────── */}
      <div className="flex flex-col lg:hidden" style={{ background: "var(--background)" }}>
        {/* Mobile toolbar */}
        <div
          className="flex items-center gap-2 border-b px-3 py-2.5 sticky top-0 z-10"
          style={{
            borderColor: "var(--surface-border)",
            background: "var(--background)",
          }}
        >
          <Link
            href="/roadmap"
            className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition hover:bg-black/10 dark:hover:bg-white/10"
            style={{
              borderColor: "var(--surface-border)",
              color: "var(--text-secondary)",
            }}
            aria-label="Kembali ke Roadmap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>

          <span className="flex-1 min-w-0 text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {roadmap.title}
          </span>

          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition"
            style={{
              borderColor: "var(--surface-border)",
              background: sidebarOpen ? "rgba(6,182,212,0.08)" : "var(--surface)",
              color: sidebarOpen ? "var(--text-accent)" : "var(--text-secondary)",
            }}
          >
            {sidebarOpen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Tutup
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Kurikulum
              </>
            )}
          </button>
        </div>

        {/* Mobile sidebar (collapsible) */}
        {sidebarOpen && (
          <div
            className="border-b"
            style={{ borderColor: "var(--surface-border)", maxHeight: "50vh", overflowY: "auto" }}
          >
            <RoadmapSidebar
              roadmap={roadmap}
              active={active}
              watched={watched}
              onSelect={(si, vi) => {
                handleSelect(si, vi);
                setSidebarOpen(false);
              }}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Mobile video */}
        <VideoPlayer
          video={currentVideo}
          step={currentStep}
          stepIndex={active.stepIndex}
          totalSteps={roadmap.steps.length}
          videoIndex={active.videoIndex}
        />

        {/* Mobile FAB toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="fixed bottom-20 right-4 z-30 flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold shadow-lg transition lg:hidden"
          style={{
            borderColor: "var(--surface-border)",
            background: "var(--surface)",
            color: "var(--text-secondary)",
          }}
        >
          {sidebarOpen ? "✕ Tutup" : "☰ Kurikulum"}
        </button>
      </div>
    </>
  );
}
