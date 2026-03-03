import Image from "next/image";
import Link from "next/link";
import { getFeeds } from "@/lib/data";
import { RelativeTime } from "@/components/relative-time";
import type { FeedCategory } from "@/types/content";

type Props = {
  currentId: number;
  category: FeedCategory;
};

export async function FeedRecommendSidebarLeft({ currentId, category }: Props) {
  const allFeeds = await getFeeds();
  const similar = allFeeds
    .filter((f) => f.category === category && f.id !== currentId)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  if (similar.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Konten {category} Serupa</h2>
      <ul className="mt-3 space-y-3">
        {similar.map((item) => (
          <li key={item.id}>
            <Link
              href={`/read/${item.slug}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-cyan-500/10"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-cyan-200 transition">
                  {item.title}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  <RelativeTime timestamp={item.createdAt} />
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function FeedRecommendSidebarRight({
  currentId,
  category,
}: Props) {
  const allFeeds = await getFeeds();

  // Kategori lain (bukan kategori saat ini)
  const otherCategories = (["Berita", "Tutorial", "Riset"] as FeedCategory[]).filter(
    (c) => c !== category
  );

  const otherFeeds = allFeeds
    .filter((f) => otherCategories.includes(f.category) && f.id !== currentId)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  if (otherFeeds.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Konten Populer Lainnya</h2>
      <ul className="mt-3 space-y-3">
        {otherFeeds.map((item) => (
          <li key={item.id}>
            <Link
              href={`/read/${item.slug}`}
              className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-cyan-500/10"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold
                  ${item.category === "Berita" ? "bg-sky-500/20 text-sky-300" : ""}
                  ${item.category === "Tutorial" ? "bg-cyan-500/20 text-cyan-300" : ""}
                  ${item.category === "Riset" ? "bg-fuchsia-500/20 text-fuchsia-300" : ""}
                `}
                >
                  {item.category}
                </span>
                <p className="text-xs font-semibold leading-snug text-slate-100 line-clamp-2 group-hover:text-cyan-200 transition">
                  {item.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

