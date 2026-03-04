import { NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;

/**
 * Protects privileged API routes with a shared secret.
 * If API_KEY is not configured, ALL requests are denied (secure by default).
 */
export function requireApiKey(request: Request): NextResponse | null {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: API_KEY not set" },
      { status: 500 }
    );
  }

  const key = request.headers.get("x-api-key");
  if (key !== API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
