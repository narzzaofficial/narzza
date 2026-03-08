import { getFeeds } from "@/lib/data";
import {
  SITE_NAME,
  BASE_URL,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_LOGO,
} from "@/lib/site-config";

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

  const items = feeds
    .map((feed) => {
      const url = `${BASE_URL}/read/${feed.slug}`;
      const pubDate = new Date(feed.createdAt).toUTCString();
      const title = xmlEscape(feed.title);
      const description = xmlEscape(feed.takeaway);
      const imageTag = feed.image
        ? `<enclosure url="${feed.image}" type="image/jpeg" length="0" />\n      <media:content url="${feed.image}" medium="image" />`
        : "";

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${feed.category}</category>
      ${imageTag}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>${SITE_EMAIL} (${SITE_NAME})</managingEditor>
    <webMaster>${SITE_EMAIL} (${SITE_NAME})</webMaster>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_LOGO}</url>
      <title>${SITE_NAME}</title>
      <link>${BASE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
