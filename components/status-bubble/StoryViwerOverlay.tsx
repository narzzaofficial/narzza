"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Story } from "@/types/content";
import { StoryContent } from "@/hooks/useStoryViwer";

type StoryViewerOverlayProps = {
  selectedStory: Story;
  popularFeeds: StoryContent[];
  currentIndex: number;
  activeFeed: StoryContent;
  prevFeed: StoryContent | null;
  nextFeed: StoryContent | null;
  viewerCover?: string;
  isFirstStory?: boolean;
  isLastStory?: boolean;
  nextStory?: Story | null;
  prevStory?: Story | null;
  nextStoryTopFeed?: StoryContent | null;
  prevStoryTopFeed?: StoryContent | null;
  storyCoverMap?: Map<number, string>;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const STORY_DURATION = 10000; // 10 seconds per card

export function StoryViewerOverlay({
  selectedStory,
  popularFeeds,
  currentIndex,
  activeFeed,
  prevFeed,
  nextFeed,
  viewerCover,
  isFirstStory = false,
  isLastStory = false,
  nextStory = null,
  prevStory = null,
  nextStoryTopFeed = null,
  prevStoryTopFeed = null,
  onClose,
  onNext,
  onPrev,
}: StoryViewerOverlayProps) {
  // progress 0→100 for the active bar
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const isLastFeed = currentIndex === popularFeeds.length - 1;
  const isFirstFeed = currentIndex === 0;

  // Reset and start animation when currentIndex changes
  useEffect(() => {
    setProgress(0);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // goNext() in the hook handles cross-story navigation and closing
        onNext();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-140 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup status populer"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="pointer-events-none relative z-10 flex w-full max-w-230 items-center justify-center gap-5 px-4">
        {/* Tombol Sebelumnya (Desktop) */}
        {prevFeed ? (
          <button
            type="button"
            onClick={onPrev}
            className="pointer-events-auto hidden w-50 shrink-0 cursor-pointer rounded-2xl border p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 xl:block"
            style={{
              background: "var(--story-card-bg)",
              borderColor: "var(--story-card-border)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--story-subtext)" }}
            >
              Sebelumnya
            </p>
            <p
              className="mt-2 overflow-hidden text-sm font-semibold leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
              style={{ color: "var(--story-title)" }}
            >
              {prevFeed.title}
            </p>
            {prevFeed.takeaway ? (
              <div
                className="mt-2.5 rounded-lg border px-2.5 py-2 text-[10px] leading-relaxed"
                style={{
                  borderColor: "var(--story-takeaway-border)",
                  background: "var(--story-takeaway-bg)",
                  color: "var(--story-takeaway-text)",
                }}
              >
                {prevFeed.takeaway}
              </div>
            ) : null}
          </button>
        ) : prevStory && isFirstFeed ? (
          <button
            type="button"
            onClick={onPrev}
            className="pointer-events-auto hidden w-50 shrink-0 cursor-pointer rounded-2xl border p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 xl:block"
            style={{
              background: "var(--story-card-bg)",
              borderColor: "var(--story-card-border)",
            }}
          >
            <p
              className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--story-subtext)" }}
            >
              {prevStory.name}
            </p>
            {prevStoryTopFeed ? (
              <>
                <p
                  className="overflow-hidden text-sm font-semibold leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                  style={{ color: "var(--story-title)" }}
                >
                  {prevStoryTopFeed.title}
                </p>
                <div
                  className="mt-2.5 rounded-lg border px-2.5 py-2 text-[10px] leading-relaxed"
                  style={{
                    borderColor: "var(--story-takeaway-border)",
                    background: "var(--story-takeaway-bg)",
                    color: "var(--story-takeaway-text)",
                  }}
                >
                  {prevStoryTopFeed.takeaway}
                </div>
              </>
            ) : (
              <p className="text-sm" style={{ color: "var(--story-subtext)" }}>
                {prevStory.type}
              </p>
            )}
          </button>
        ) : (
          <div className="hidden w-50 shrink-0 xl:block" />
        )}

        {/* Modal Utama */}
        <article
          className="pointer-events-auto relative h-[88vh] max-h-180 w-full max-w-100 overflow-hidden rounded-[28px] border shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
          style={{
            background: "var(--story-card-bg)",
            borderColor: "var(--story-card-border)",
          }}
        >
          {/* decorative gradient overlay — subtle, works on both themes */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-20 [data-theme=light]_&:opacity-10 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.3),transparent_45%),radial-gradient(circle_at_92%_0%,rgba(217,70,239,0.2),transparent_40%)]" />

          <div className="relative z-10 flex h-full flex-col p-5">
            {/* Progress Bars */}
            <div className="mb-3 flex gap-1.5">
              {popularFeeds.map((feed, index) => (
                <span
                  key={feed.id}
                  className="relative h-1 flex-1 overflow-hidden rounded-full"
                  style={{ background: "var(--story-progress-inactive)" }}
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: "var(--story-progress-active)",
                      width:
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                            ? `${progress}%`
                            : "0%",
                      transition: index === currentIndex ? "none" : undefined,
                    }}
                  />
                </span>
              ))}
            </div>

            {/* Header Modal */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--story-accent)" }}
                >
                  Status Populer
                </p>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--story-subtext)" }}
                >
                  {selectedStory.name} • {selectedStory.type}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border px-3 py-1 text-[11px] transition"
                style={{
                  borderColor: "var(--story-btn-border)",
                  color: "var(--story-btn-text)",
                  background: "var(--story-btn-bg)",
                }}
                onClick={onClose}
              >
                Tutup
              </button>
            </div>

            {/* Konten Utama — scrollable, touch-friendly */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain rounded-2xl border p-5"
              style={{
                borderColor: "var(--story-inner-border)",
                background: "var(--story-inner-bg)",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {viewerCover && (
                <div
                  className="mb-4 overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--story-img-border)" }}
                >
                  <Image
                    src={viewerCover}
                    alt={`Status ${selectedStory.name}`}
                    width={720}
                    height={400}
                    className="h-44 w-full object-cover"
                    priority
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                  style={{
                    borderColor: "var(--story-badge-border)",
                    background: "var(--story-badge-bg)",
                    color: "var(--story-badge-text)",
                  }}
                >
                  #{currentIndex + 1} Populer
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--story-accent)" }}
                >
                  Score {activeFeed.popularity}
                </span>
              </div>

              <h3
                className="mt-4 text-2xl font-bold leading-tight"
                style={{ color: "var(--story-title)" }}
              >
                {activeFeed.title}
              </h3>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--story-body)" }}
              >
                {activeFeed.lines[0]?.text}
              </p>

              <div
                className="mt-5 rounded-xl border px-3 py-2.5 text-xs leading-relaxed"
                style={{
                  borderColor: "var(--story-takeaway-border)",
                  background: "var(--story-takeaway-bg)",
                  color: "var(--story-takeaway-text)",
                }}
              >
                <span
                  className="mb-1 block text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--story-takeaway-label)" }}
                >
                  Ringkasan
                </span>
                {activeFeed.takeaway}
              </div>
            </div>

            {/* Navigasi Bawah */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={isFirstFeed && isFirstStory}
                className="rounded-full border px-4 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  borderColor: "var(--story-nav-border)",
                  color: "var(--story-nav-text)",
                  background: "var(--story-nav-bg)",
                }}
              >
                Sebelumnya
              </button>
              <Link
                href={activeFeed.detailHref}
                className="rounded-full border px-5 py-2 text-xs font-bold transition"
                style={{
                  borderColor: "var(--story-cta-border)",
                  background: "var(--story-cta-bg)",
                  color: "var(--story-cta-text)",
                }}
                onClick={onClose}
              >
                {activeFeed.kind === "book" ? "Lihat Buku" : "Baca Artikel"}
              </Link>
              <button
                type="button"
                onClick={onNext}
                disabled={isLastFeed && isLastStory}
                className="rounded-full border px-4 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  borderColor: "var(--story-nav-border)",
                  color: "var(--story-nav-text)",
                  background: "var(--story-nav-bg)",
                }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </article>

        {/* Tombol Selanjutnya (Desktop) */}
        {nextFeed ? (
          <button
            type="button"
            onClick={onNext}
            className="pointer-events-auto hidden w-50 shrink-0 cursor-pointer rounded-2xl border p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 xl:block"
            style={{
              background: "var(--story-card-bg)",
              borderColor: "var(--story-card-border)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--story-subtext)" }}
            >
              Selanjutnya
            </p>
            <p
              className="mt-2 overflow-hidden text-sm font-semibold leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
              style={{ color: "var(--story-title)" }}
            >
              {nextFeed.title}
            </p>
            {nextFeed.takeaway ? (
              <div
                className="mt-2.5 rounded-lg border px-2.5 py-2 text-[10px] leading-relaxed"
                style={{
                  borderColor: "var(--story-takeaway-border)",
                  background: "var(--story-takeaway-bg)",
                  color: "var(--story-takeaway-text)",
                }}
              >
                {nextFeed.takeaway}
              </div>
            ) : null}
          </button>
        ) : nextStory && isLastFeed ? (
          <button
            type="button"
            onClick={onNext}
            className="pointer-events-auto hidden w-50 shrink-0 cursor-pointer rounded-2xl border p-4 text-left opacity-60 backdrop-blur-sm transition hover:opacity-90 xl:block"
            style={{
              background: "var(--story-card-bg)",
              borderColor: "var(--story-card-border)",
            }}
          >
            <p
              className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--story-subtext)" }}
            >
              {nextStory.name}
            </p>
            {nextStoryTopFeed ? (
              <>
                <p
                  className="overflow-hidden text-sm font-semibold leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                  style={{ color: "var(--story-title)" }}
                >
                  {nextStoryTopFeed.title}
                </p>
                <div
                  className="mt-2.5 rounded-lg border px-2.5 py-2 text-[10px] leading-relaxed"
                  style={{
                    borderColor: "var(--story-takeaway-border)",
                    background: "var(--story-takeaway-bg)",
                    color: "var(--story-takeaway-text)",
                  }}
                >
                  {nextStoryTopFeed.takeaway}
                </div>
              </>
            ) : (
              <p className="text-sm" style={{ color: "var(--story-subtext)" }}>
                {nextStory.type}
              </p>
            )}
          </button>
        ) : (
          <div className="hidden w-50 shrink-0 xl:block" />
        )}
      </div>
    </div>
  );
}
