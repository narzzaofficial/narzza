import { getFeeds } from "@/lib/data";
import { BASE_URL, SITE_NAME, SITE_LANGUAGE } from "@/lib/site-config";

// Google News only indexes articles published within the last 48 hours
const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;

export const revalidate = 300;

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const feeds = await getFeeds();
  const cutoff = Date.now() - NEWS_WINDOW_MS;
  const recentFeeds = feeds.filter((feed) => feed.createdAt >= cutoff);

  const items = recentFeeds
    .map((feed) => {
      const url = `${BASE_URL}/read/${feed.slug}`;
      const pubDate = new Date(feed.createdAt).toISOString();
      const title = xmlEscape(feed.title);

      return `
  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
        <news:language>${SITE_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
