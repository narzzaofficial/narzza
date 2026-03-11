import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

/**
 * Protects privileged API routes using Clerk session.
 * Returns a 401/403 NextResponse if the request is not from the admin,
 * or null if authentication passes (caller can proceed).
 *
 * Usage:
 *   const authError = await requireAdmin();
 *   if (authError) return authError;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (!ADMIN_EMAIL) {
    console.error("⚠️ ADMIN_EMAIL env var is not set — all admin API calls denied");
    return NextResponse.json(
      { error: "Server misconfigured: ADMIN_EMAIL not set" },
      { status: 500 }
    );
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  if (primaryEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // ✅ Auth passed
}
