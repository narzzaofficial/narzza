"use client";

import { useState } from "react";
import type { Roadmap, RoadmapStep, RoadmapVideo } from "@/types/roadmaps";

/* ─── tiny helpers ─────────────────────────────────────────────── */
function totalVideos(steps: RoadmapStep[]) {
  return steps.reduce((sum, s) => sum + s.videos.length, 0);
}

/* ─── Video Player ─────────────────────────────────────────────── */
function VideoPlayer({
  video,
  stepTitle,
}: {
  video: RoadmapVideo;
  stepTitle: string;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* iframe */}
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950 shadow-lg shadow-cyan-500/5">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
          title={stepTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>

      {/* Video meta */}
      <div className="mt-4 space-y-1">
        <h3 className="text-lg font-semibold text-slate-50">{stepTitle}</h3>
        <p className="text-sm text-slate-400">
          oleh{" "}
          <span className="font-medium text-cyan-300">{video.author}</span>
        </p>
      </div>
    </div>
  );
}

/* ─── Sidebar item ─────────────────────────────────────────────── */
function PlaylistItem({
  videoIndex,
  step,
  video,
  isActive,
  isWatched,
  globalIndex,
  onClick,
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
      className={`group w-full rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
        isActive
          ? "bg-cyan-500/15 ring-1 ring-cyan-400/40"
          : "hover:bg-slate-800/60"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Index / checkmark */}
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1 transition-colors ${
            isWatched
              ? "bg-emerald-500/20 text-emerald-300 ring-emerald-400/40"
              : isActive
                ? "bg-cyan-500/20 text-cyan-300 ring-cyan-400/40"
                : "bg-slate-700/60 text-slate-400 ring-slate-600/40"
          }`}
        >
          {isWatched ? "✓" : globalIndex}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-semibold leading-snug transition-colors ${
              isActive
                ? "text-cyan-200"
                : isWatched
                  ? "text-slate-400"
                  : "text-slate-200 group-hover:text-cyan-200"
            }`}
          >
            {step.title}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
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

/* ─── Step group heading ────────────────────────────────────────── */
function StepHeading({
  step,
  stepNumber,
  videoCount,
}: {
  step: RoadmapStep;
  stepNumber: number;
  videoCount: number;
}) {
  return (
    <div className="px-3 pb-1 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-[10px] font-bold text-cyan-400 ring-1 ring-cyan-400/30">
          {stepNumber}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {step.title}
        </p>
      </div>
      <p className="ml-7 mt-0.5 text-[10px] text-slate-600">{videoCount} video</p>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
type ActiveVideo = { stepIndex: number; videoIndex: number };

export function RoadmapCourseViewer({ roadmap }: { roadmap: Roadmap }) {
  const [active, setActive] = useState<ActiveVideo>({ stepIndex: 0, videoIndex: 0 });
  const [watched, setWatched] = useState<Set<string>>(new Set());

  const markWatched = (stepIndex: number, videoIndex: number) => {
    setWatched((prev) => new Set(prev).add(`${stepIndex}-${videoIndex}`));
  };

  const handleSelect = (stepIndex: number, videoIndex: number) => {
    markWatched(active.stepIndex, active.videoIndex);
    setActive({ stepIndex, videoIndex });
    // scroll to top of the player on mobile
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      document.getElementById("roadmap-player")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentStep = roadmap.steps[active.stepIndex];
  const currentVideo = currentStep?.videos[active.videoIndex];

  const total = totalVideos(roadmap.steps);
  const watchedCount = watched.size;

  // Build flat list for global numbering
  let globalCounter = 0;

  if (!currentStep || !currentVideo) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400">
        Roadmap ini belum memiliki video materi.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {/* ── Main Video Area ─────────────────────────────────────── */}
      <div id="roadmap-player" className="flex-1 min-w-0 space-y-4">
        {/* Player */}
        <div className="glass-panel overflow-hidden rounded-2xl p-4 md:p-5">
          <VideoPlayer video={currentVideo} stepTitle={currentStep.title} />

          {/* Step description */}
          <div className="mt-5 border-t border-slate-700/50 pt-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="roadmap-badge-neutral rounded-full border px-2.5 py-0.5 text-[11px]">
                {currentStep.focus}
              </span>
              <span className="text-[11px] text-slate-500">
                Langkah {active.stepIndex + 1} dari {roadmap.steps.length}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="glass-panel rounded-xl px-4 py-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Progress Belajar</span>
            <span className="text-cyan-300">
              {watchedCount}/{total} video
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/60">
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: total > 0 ? `${(watchedCount / total) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* ── Playlist Sidebar ─────────────────────────────────────── */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0">
        <div className="glass-panel rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-700/50 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-100">Kurikulum</h2>
            <p className="text-[11px] text-slate-400">
              {roadmap.steps.length} langkah • {total} video
            </p>
          </div>

          {/* Playlist */}
          <div className="max-h-130 overflow-y-auto py-1 no-scrollbar">
            {roadmap.steps.map((step, si) => (
              <div key={step.title}>
                <StepHeading
                  step={step}
                  stepNumber={si + 1}
                  videoCount={step.videos.length}
                />
                <div className="px-1 pb-1">
                  {step.videos.map((video, vi) => {
                    globalCounter++;
                    const isActive = active.stepIndex === si && active.videoIndex === vi;
                    const isWatched = watched.has(`${si}-${vi}`);
                    return (
                      <PlaylistItem
                        key={`${si}-${vi}`}
                        videoIndex={vi}
                        step={step}
                        video={video}
                        isActive={isActive}
                        isWatched={isWatched}
                        globalIndex={globalCounter}
                        onClick={() => handleSelect(si, vi)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}





