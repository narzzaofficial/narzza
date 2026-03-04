import { NextRequest, NextResponse } from "next/server";
import {
  INDEXNOW_KEY,
  INDEXNOW_ENGINES,
  BASE_URL,
} from "@/lib/indexnow-config";

export const dynamic = "force-dynamic";

/**
 * GET /api/indexnow
 * Returns the current IndexNow key — useful for health checks.
 * The actual key file served to search engines is at /{key}.txt (public folder).
 */
export function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyUrl: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
  });
}

/**
 * POST /api/indexnow
 * Pings all configured IndexNow search engines with one or more URLs.
 *
 * Body: { urls: string[] }   — array of full URLs to submit
 *   or: { url: string }      — single URL shorthand
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrls: string[] = body.urls ?? (body.url ? [body.url] : []);

    if (rawUrls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    const payload = {
      host: new URL(BASE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: rawUrls,
    };

    const results = await Promise.allSettled(
      INDEXNOW_ENGINES.map((endpoint) =>
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(payload),
        })
      )
    );

    const summary = results.map((r, i) => ({
      engine: INDEXNOW_ENGINES[i],
      status: r.status === "fulfilled" ? r.value.status : "error",
    }));

    return NextResponse.json({ submitted: rawUrls.length, engines: summary });
  } catch (error) {
    console.error("IndexNow ping error:", error);
    return NextResponse.json(
      { error: "Failed to ping IndexNow" },
      { status: 500 }
    );
  }
}
