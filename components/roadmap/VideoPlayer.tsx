"use client";

import type { RoadmapVideo, RoadmapStep } from "@/types/roadmaps";

type VideoPlayerProps = {
  video: RoadmapVideo;
  step: RoadmapStep;
  stepIndex: number;
  totalSteps: number;
  videoIndex: number;
};

export function VideoPlayer({
  video,
  step,
  stepIndex,
  totalSteps,
  videoIndex,
}: VideoPlayerProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* ── YouTube iframe — full width, flush left ──────────────── */}
      <div className="w-full bg-black">
        <div className="aspect-video w-full overflow-hidden">
          <iframe
            key={video.id}
            src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&autoplay=0`}
            title={step.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* ── Meta ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 px-5 py-5 xl:px-8 xl:py-6 overflow-y-auto">
        {/* Title */}
        <div>
          <h2
            className="text-xl font-bold leading-snug xl:text-2xl 2xl:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            {step.title}
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
            Video {videoIndex + 1} • oleh{" "}
            <span className="font-semibold" style={{ color: "var(--text-accent)" }}>
              {video.author}
            </span>
          </p>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "var(--surface-border)" }} />

        {/* Focus + step counter */}
        <div className="flex flex-wrap items-center gap-2">
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
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Langkah {stepIndex + 1} dari {totalSteps}
          </span>
        </div>

        {/* Description */}
        {step.description && (
          <p
            className="text-sm leading-relaxed xl:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {step.description}
          </p>
        )}
      </div>
    </div>
  );
}
