import Link from "next/link";
import { getFeeds } from "@/lib/data";

// Words to skip when extracting keywords
const STOPWORDS = new Set([
  "dan",
  "yang",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "ini",
  "itu",
  "atau",
  "pada",
  "adalah",
  "akan",
  "juga",
  "ada",
  "bisa",
  "cara",
  "baru",
  "lebih",
  "dalam",
  "oleh",
  "the",
  "and",
  "for",
  "with",
  "from",
  "how",
  "why",
  "what",
  "when",
  "new",
  "vs",
  "a",
  "an",
  "in",
  "of",
  "to",
  "is",
  "it",
  "by",
  "be",
  "as",
  "at",
  "on",
  "up",
  "via",
  "use",
  "using",
  "build",
  "make",
  "get",
  "set",
  "run",
  "top",
  "let",
  "can",
  "now",
  "all",
]);

function extractKeywords(
  feeds: Awaited<ReturnType<typeof getFeeds>>
): string[] {
  const freq = new Map<string, number>();

  // Take top 20 most popular feeds
  const topFeeds = [...feeds]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20);

  for (const feed of topFeeds) {
    const words = feed.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w));

    for (const word of words) {
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }

  // Sort by frequency, take top 8
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

const TrendingSection = async () => {
  const feeds = await getFeeds();
  const keywords = extractKeywords(feeds);

  return (
    <div className="sidebar-widget">
      <h2 className="widget-heading">Trending</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <Link
            key={keyword}
            href={`/tag/${keyword}`}
            className="rounded-full border px-3 py-1 text-xs font-medium transition hover:border-cyan-400/60"
            style={{
              borderColor: "var(--surface-border)",
              color: "var(--text-accent)",
              background: "var(--surface)",
            }}
          >
            #{keyword}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
