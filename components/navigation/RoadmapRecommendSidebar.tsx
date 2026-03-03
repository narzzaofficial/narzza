import Image from "next/image";
import Link from "next/link";
import { getRoadmaps } from "@/lib/data";

type Props = {
  currentSlug: string;
};

export async function RoadmapRecommendSidebarLeft({ currentSlug }: Props) {
  const allRoadmaps = await getRoadmaps();
  const others = allRoadmaps.filter((r) => r.slug !== currentSlug).slice(0, 5);

  if (others.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Roadmap Lainnya</h2>
      <ul className="mt-3 space-y-3">
        {others.map((roadmap) => (
          <li key={roadmap.slug}>
            <Link
              href={`/roadmap/${roadmap.slug}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-cyan-500/10"
            >
              {roadmap.image && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={roadmap.image}
                    alt={roadmap.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="48px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-cyan-200 transition">
                  {roadmap.title}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] text-cyan-300">
                    {roadmap.level}
                  </span>
                  <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300">
                    {roadmap.duration}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function RoadmapRecommendSidebarRight({ currentSlug }: Props) {
  const allRoadmaps = await getRoadmaps();
  const others = allRoadmaps.filter((r) => r.slug !== currentSlug);

  // Ambil roadmap dengan level berbeda atau tags serupa
  const featured = others.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Eksplorasi Roadmap</h2>
      <div className="mt-3 space-y-2">
        {featured.map((roadmap) => (
          <Link
            key={roadmap.slug}
            href={`/roadmap/${roadmap.slug}`}
            className="group block rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 transition hover:border-cyan-300/50 hover:bg-cyan-500/10"
          >
            <p className="text-xs font-semibold text-slate-100 line-clamp-1 group-hover:text-cyan-200 transition">
              {roadmap.title}
            </p>
            <p className="mt-1 text-[10px] text-slate-400 line-clamp-2">
              {roadmap.summary}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {roadmap.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/roadmap"
        className="mt-3 block text-center text-xs text-cyan-400 hover:text-cyan-300 transition"
      >
        Lihat Semua Roadmap →
      </Link>
    </div>
  );
}

