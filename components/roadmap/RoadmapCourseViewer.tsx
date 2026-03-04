"use client";

import { useState } from "react";
import Link from "next/link";
import type { Roadmap } from "@/types/roadmaps";
import { RoadmapSidebar } from "./RoadmapSidebar";
import { VideoPlayer } from "./VideoPlayer";

type ActiveVideo = { stepIndex: number; videoIndex: number };
type MobileTab = "info" | "kurikulum";

export function RoadmapCourseViewer({ roadmap }: { roadmap: Roadmap }) {
  const [active, setActive] = useState<ActiveVideo>({ stepIndex: 0, videoIndex: 0 });
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("info");

  const markWatched = (si: number, vi: number) =>
    setWatched((prev) => new Set(prev).add(`${si}-${vi}`));

  const handleSelect = (si: number, vi: number) => {
    markWatched(active.stepIndex, active.videoIndex);
    setActive({ stepIndex: si, videoIndex: vi });
    setMobileTab("info"); // switch back to video after selecting
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
      {/* ════════════════════════════════════════════════════════════
          DESKTOP layout  (lg and above = 1024px+)
          Sidebar left | Video right
      ════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex" style={{ background: "var(--background)" }}>

        {/* Sidebar */}
        <div
          className={`shrink-0 transition-all duration-300 overflow-hidden ${
            sidebarOpen ? "w-72 2xl:w-80 3xl:w-96" : "w-0"
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

        {/* Video area */}
        <div className="relative flex flex-1 flex-col min-w-0">

          {/* Desktop header */}
          <div
            className="flex items-center gap-3 border-b px-4 py-2.5 sticky top-0 z-40"
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
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition hover:bg-black/10 dark:hover:bg-white/10"
              style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
              title={sidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div className="h-5 w-px shrink-0" style={{ background: "var(--surface-border)" }} />

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                {roadmap.title}
              </h1>
              <p className="mt-0.5 text-[11px] truncate" style={{ color: "var(--text-secondary)" }}>
                {roadmap.summary}
              </p>
            </div>

            {/* Badges — only at xl+ to avoid crowding at 1024px */}
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

          <VideoPlayer
            video={currentVideo}
            step={currentStep}
            stepIndex={active.stepIndex}
            totalSteps={roadmap.steps.length}
            videoIndex={active.videoIndex}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          MOBILE layout  (below lg = below 1024px)
          YouTube-style: video top → tab bar → content panel
      ════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:hidden min-h-screen" style={{ background: "var(--background)" }}>

        {/* ── Sticky top bar: back + title ── */}
        <div
          className="sticky top-0 z-20 flex items-center gap-2 px-3 py-2 border-b"
          style={{
            borderColor: "var(--surface-border)",
            background: "var(--background)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link
            href="/roadmap"
            aria-label="Kembali ke Roadmap"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition active:scale-95"
            style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
              {roadmap.title}
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-secondary)" }}>
              {roadmap.level} · {roadmap.duration}
            </p>
          </div>
        </div>

        {/* ── Video player — full width, aspect-video ── */}
        <div className="w-full bg-black">
          <div className="aspect-video w-full">
            <iframe
              key={currentVideo.id}
              src={`https://www.youtube.com/embed/${currentVideo.id}?rel=0&modestbranding=1&autoplay=0`}
              title={currentStep.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          </div>
        </div>

        {/* ── YouTube-style tab bar ── */}
        <div
          className="sticky z-10 flex border-b"
          style={{
            top: "52px", // height of viewer's own sticky top bar
            background: "var(--background)",
            borderColor: "var(--surface-border)",
          }}
        >
          {(["info", "kurikulum"] as MobileTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMobileTab(tab)}
              className="flex-1 py-2.5 text-xs font-semibold capitalize tracking-wide transition"
              style={{
                color: mobileTab === tab ? "var(--text-accent)" : "var(--text-secondary)",
                borderBottom: mobileTab === tab
                  ? "2px solid var(--text-accent)"
                  : "2px solid transparent",
                background: "transparent",
              }}
            >
              {tab === "info" ? "📋 Info Video" : "☰ Kurikulum"}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="flex-1 overflow-y-auto pb-8">
          {mobileTab === "info" && (
            <MobileVideoInfo
              step={currentStep}
              video={currentVideo}
              stepIndex={active.stepIndex}
              totalSteps={roadmap.steps.length}
              videoIndex={active.videoIndex}
              roadmap={roadmap}
            />
          )}
          {mobileTab === "kurikulum" && (
            <RoadmapSidebar
              roadmap={roadmap}
              active={active}
              watched={watched}
              onSelect={handleSelect}
              onClose={() => setMobileTab("info")}
            />
          )}
        </div>
      </div>
    </>
  );
}

/* ── Mobile video info panel (replaces VideoPlayer meta on mobile) ── */
function MobileVideoInfo({
  step,
  video,
  stepIndex,
  totalSteps,
  videoIndex,
  roadmap,
}: {
  step: import("@/types/roadmaps").RoadmapStep;
  video: import("@/types/roadmaps").RoadmapVideo;
  stepIndex: number;
  totalSteps: number;
  videoIndex: number;
  roadmap: Roadmap;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Step + video counter */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
        <span
          className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 font-semibold text-cyan-400"
        >
          {roadmap.level}
        </span>
        <span>Langkah {stepIndex + 1} dari {totalSteps}</span>
        <span>•</span>
        <span>Video {videoIndex + 1}</span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
        {step.title}
      </h2>

      {/* Author */}
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        oleh{" "}
        <span className="font-semibold" style={{ color: "var(--text-accent)" }}>
          {video.author}
        </span>
      </p>

      <div className="border-t" style={{ borderColor: "var(--surface-border)" }} />

      {/* Focus badge */}
      <div className="flex flex-wrap gap-2">
        <span
          className="rounded-full border px-3 py-1 text-xs font-semibold"
          style={{
            borderColor: "var(--surface-border)",
            color: "var(--text-secondary)",
            background: "var(--surface)",
          }}
        >
          {step.focus}
        </span>
        {roadmap.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-xs"
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

      {/* Description */}
      {step.description && (
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {step.description}
        </p>
      )}

      <div className="border-t" style={{ borderColor: "var(--surface-border)" }} />

      {/* Roadmap summary */}
      <div
        className="rounded-xl border p-3"
        style={{ borderColor: "var(--surface-border)", background: "var(--surface)" }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Tentang Roadmap
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {roadmap.summary}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
          <span
            className="rounded-full border px-2 py-0.5"
            style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
          >
            {roadmap.duration}
          </span>
          <span
            className="rounded-full border px-2 py-0.5"
            style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
          >
            {roadmap.steps.length} langkah
          </span>
        </div>
      </div>
    </div>
  );
}
