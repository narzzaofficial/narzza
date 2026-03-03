"use client";

import { useState } from "react";
import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/types/roadmaps";

function totalVideos(steps: RoadmapStep[]) {
  return steps.reduce((sum, s) => sum + s.videos.length, 0);
}

/* ─── Video Player ─────────────────────────────────────────────── */
function VideoPlayer({ video, stepTitle }: { video: RoadmapVideo; stepTitle: string }) {
  return (
    <div className="flex flex-col">
      {/* iframe */}
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-xl">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
          title={stepTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

/* ─── Playlist Item ─────────────────────────────────────────────── */
function PlaylistItem({
  videoIndex, step, video, isActive, isWatched, globalIndex, onClick,
}: {
  videoIndex: number;
  step: RoadmapStep;
  video: RoadmapVideo;
  isActive: boolean;
  isWatched: boolean;
  globalIndex: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full px-4 py-2.5 text-left transition-colors"
      style={{
        background: isActive ? "rgba(6,182,212,0.08)" : "transparent",
        borderLeft: isActive ? "3px solid #06b6d4" : "3px solid transparent",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Index / checkmark */}
        <div
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1 transition-colors"
          style={{
            background: isWatched
              ? "rgba(16,185,129,0.2)"
              : isActive
                ? "rgba(6,182,212,0.2)"
                : "rgba(100,116,139,0.2)",
            color: isWatched ? "#6ee7b7" : isActive ? "#67e8f9" : "var(--text-secondary)",
          }}
        >
          {isWatched ? "✓" : globalIndex}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold leading-snug"
            style={{ color: isActive ? "#67e8f9" : "var(--text-primary)" }}
          >
            {step.title}
          </p>
          <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Video {videoIndex + 1} • {video.author}
          </p>
        </div>

        {/* Playing indicator */}
        {isActive && (
          <div className="mt-1 flex shrink-0 items-end gap-0.5 h-3">
            <span className="w-0.5 rounded-full bg-cyan-400 animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: "40%" }} />
            <span className="w-0.5 rounded-full bg-cyan-400 animate-[equalizer_0.8s_ease-in-out_0.2s_infinite]" style={{ height: "100%" }} />
            <span className="w-0.5 rounded-full bg-cyan-400 animate-[equalizer_0.8s_ease-in-out_0.4s_infinite]" style={{ height: "60%" }} />
          </div>
        )}
      </div>
    </button>
  );
}

/* ─── Step Group Heading ─────────────────────────────────────────── */
function StepHeading({ step, stepNumber, videoCount }: { step: RoadmapStep; stepNumber: number; videoCount: number }) {
  return (
    <div className="px-4 pb-1 pt-4">
      <div className="flex items-center gap-2">
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1"
          style={{ background: "rgba(6,182,212,0.12)", color: "#67e8f9", outline: "1px solid rgba(6,182,212,0.3)" }}
        >
          {stepNumber}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
          {step.title}
        </p>
      </div>
      <p className="ml-7 mt-0.5 text-[10px]" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>
        {videoCount} video
      </p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
type ActiveVideo = { stepIndex: number; videoIndex: number };

export function RoadmapCourseViewer({ roadmap }: { roadmap: Roadmap }) {
  const [active, setActive] = useState<ActiveVideo>({ stepIndex: 0, videoIndex: 0 });
  const [watched, setWatched] = useState<Set<string>>(new Set());

  const markWatched = (si: number, vi: number) =>
    setWatched((prev) => new Set(prev).add(`${si}-${vi}`));

  const handleSelect = (si: number, vi: number) => {
    markWatched(active.stepIndex, active.videoIndex);
    setActive({ stepIndex: si, videoIndex: vi });
    if (typeof window !== "undefined" && window.innerWidth < 1024)
      document.getElementById("roadmap-player")?.scrollIntoView({ behavior: "smooth" });
  };

  // Flat list for prev/next navigation
  const flatList: { si: number; vi: number }[] = [];
  roadmap.steps.forEach((step, si) => step.videos.forEach((_, vi) => flatList.push({ si, vi })));
  const flatIndex = flatList.findIndex((f) => f.si === active.stepIndex && f.vi === active.videoIndex);
  const prevItem = flatIndex > 0 ? flatList[flatIndex - 1] : null;
  const nextItem = flatIndex < flatList.length - 1 ? flatList[flatIndex + 1] : null;

  const currentStep = roadmap.steps[active.stepIndex];
  const currentVideo = currentStep?.videos[active.videoIndex];
  const total = totalVideos(roadmap.steps);
  const watchedCount = watched.size;
  let globalCounter = 0;

  if (!currentStep || !currentVideo) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center" style={{ color: "var(--text-secondary)" }}>
        Roadmap ini belum memiliki video materi.
      </div>
    );
  }

  return (
    // Coursera-style: playlist left, player right
    <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border lg:flex-row lg:min-h-[80vh]"
      style={{ borderColor: "var(--surface-border)", background: "var(--surface)" }}
    >
      {/* ── LEFT: Playlist / Kurikulum ───────────────────────────── */}
      <aside
        className="w-full shrink-0 border-b lg:w-72 xl:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto lg:max-h-[80vh]"
        style={{ borderColor: "var(--surface-border)" }}
      >
        {/* Playlist header */}
        <div className="sticky top-0 z-10 border-b px-4 py-3" style={{ borderColor: "var(--surface-border)", background: "var(--surface)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Kurikulum</h2>
          <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            {roadmap.steps.length} langkah • {total} video
          </p>
        </div>

        {/* Steps & videos */}
        <div className="pb-4">
          {roadmap.steps.map((step, si) => (
            <div key={step.title}>
              <StepHeading step={step} stepNumber={si + 1} videoCount={step.videos.length} />
              {step.videos.map((video, vi) => {
                globalCounter++;
                return (
                  <PlaylistItem
                    key={`${si}-${vi}`}
                    videoIndex={vi}
                    step={step}
                    video={video}
                    isActive={active.stepIndex === si && active.videoIndex === vi}
                    isWatched={watched.has(`${si}-${vi}`)}
                    globalIndex={globalCounter}
                    onClick={() => handleSelect(si, vi)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* ── RIGHT: Video Player + Meta ───────────────────────────── */}
      <div id="roadmap-player" className="flex flex-1 flex-col">
        {/* Video */}
        <div className="w-full bg-black">
          <VideoPlayer video={currentVideo} stepTitle={currentStep.title} />
        </div>

        {/* Meta area */}
        <div className="flex flex-1 flex-col p-5 md:p-6">
          {/* Title & author */}
          <h3 className="text-xl font-bold md:text-2xl" style={{ color: "var(--text-primary)" }}>
            {currentStep.title}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            oleh{" "}
            <span className="font-semibold" style={{ color: "var(--text-accent)" }}>
              {currentVideo.author}
            </span>
          </p>

          {/* Divider */}
          <div className="my-4 border-t" style={{ borderColor: "var(--surface-border)" }} />

          {/* Focus tag + step info */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border px-3 py-1 text-xs font-semibold"
              style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
            >
              {currentStep.focus}
            </span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Langkah {active.stepIndex + 1} dari {roadmap.steps.length}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {currentStep.description}
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Progress */}
          <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--surface-border)" }}>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Progress Belajar
              </span>
              <span style={{ color: "var(--text-accent)" }}>
                {watchedCount}/{total} video
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-border)" }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: total > 0 ? `${(watchedCount / total) * 100}%` : "0%" }}
              />
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => prevItem && handleSelect(prevItem.si, prevItem.vi)}
              disabled={!prevItem}
              className="rounded-full border px-4 py-2 text-xs font-medium transition disabled:opacity-30"
              style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() => nextItem && handleSelect(nextItem.si, nextItem.vi)}
              disabled={!nextItem}
              className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-5 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-30"
            >
              Video Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
