import Image from "next/image";
import Link from "next/link";
import type { Feed } from "@/types/content";
import { RelativeTime } from "@/components/relative-time";

type FeedTitleCardProps = {
  feed: Feed;
  index: number;
};

export function FeedTitleCard({ feed, index }: FeedTitleCardProps) {
  const categoryConfig =
    feed.category === "Berita"
      ? {
          badge: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30",
          accent: "group-hover:border-sky-400/50",
          icon: "📰",
        }
      : feed.category === "Tutorial"
        ? {
            badge:
              "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
            accent: "group-hover:border-emerald-400/50",
            icon: "🎓",
          }
        : {
            badge:
              "bg-fuchsia-500/20 text-fuchsia-300 ring-1 ring-fuchsia-500/30",
            accent: "group-hover:border-fuchsia-400/50",
            icon: "🔬",
          };

  return (
    <Link
      href={`/read/${feed.slug}`}
      className={`feed-card glass-panel group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 ${categoryConfig.accent}`}
      style={{ animationDelay: `${index * 110}ms` }}
    >
      {/* Mobile: Compact 2-column-friendly card */}
      <div className="flex flex-col md:hidden">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-800/40">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="50vw"
            priority={index === 0}
          />
          {/* Category badge overlay */}
          <span
            className={`absolute left-2 top-2 category-badge text-[9px] px-1.5 py-0.5 ${categoryConfig.badge}`}
          >
            {categoryConfig.icon}
          </span>
        </div>

        {/* Compact content */}
        <div className="flex flex-1 flex-col p-2.5">
          <h2 className="text-xs font-semibold leading-snug text-slate-50 group-hover:text-cyan-200 transition-colors">
            {feed.title}
          </h2>
          <div className="mt-auto flex items-center justify-between gap-1 pt-2">
            <span className="text-[9px] text-slate-500">
              <RelativeTime timestamp={feed.createdAt} />
            </span>
            <span className="text-[9px] font-semibold text-cyan-400 group-hover:text-cyan-300">
              Baca
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal Layout (Image Right) */}
      <div className="hidden md:flex items-stretch gap-4 p-4">
        {/* Content Section - Main Focus */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Top Section: Badge & Time */}
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className={`category-badge ${categoryConfig.badge}`}>
                <span className="text-sm">{categoryConfig.icon}</span>
                {feed.category}
              </span>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <RelativeTime timestamp={feed.createdAt} />
              </div>
            </div>

            {/* Title */}
            <h2 className="card-title md:text-lg">{feed.title}</h2>

            {/* Main Content Box */}
            <div className="inti-cepat-box">
              <div className="mb-1.5 flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xs font-semibold text-cyan-300">
                  Inti Cepat
                </span>
              </div>
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-300">
                {feed.takeaway}
              </p>
            </div>
          </div>

          {/* Bottom Section: CTA */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <svg
              className="h-3.5 w-3.5 text-cyan-400/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="font-medium text-cyan-400 transition-colors group-hover:text-cyan-300">
              Buka Chat Q&A
            </span>
            <svg
              className="h-3 w-3 text-cyan-400 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Image Thumbnail - Symmetric */}
        <div className="relative h-32 w-32 shrink-0 self-center overflow-hidden rounded-lg bg-slate-800/40 shadow-md md:h-36 md:w-36">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 128px, 144px"
            priority={index === 0}
          />
        </div>
      </div>
    </Link>
  );
}
