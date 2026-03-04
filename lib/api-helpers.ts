import { NextResponse } from "next/server";
import type { ZodError } from "zod";

/** Returns a 503 response when the database is unavailable */
export function dbUnavailableResponse(): NextResponse {
  return NextResponse.json(
    { error: "Database connection failed" },
    { status: 503 }
  );
}

/** Returns a 400 response for Zod validation failures */
export function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { error: "Validation failed", details: error.flatten() },
    { status: 400 }
  );
}

/** Returns a 400 response for an invalid numeric ID */
export function invalidIdResponse(): NextResponse {
  return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
}

/**
 * Returns a JSON response with CDN-friendly caching headers.
 * s-maxage: cached by Vercel Edge for `ttl` seconds.
 * stale-while-revalidate: serve stale while refreshing in background.
 */
export function cachedJson(
  data: unknown,
  ttl = 60,
  swr = 300
): NextResponse {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${swr}`,
    },
  });
}
