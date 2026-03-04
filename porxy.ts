import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminPublic = createRouteMatcher([
  "/admin/sign-in(.*)",
  "/admin/unauthorized",
]);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export default clerkMiddleware(async (auth, req) => {
  // Always inject the current pathname for layouts to read
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  // Allow sign-in and unauthorized pages to be public
  if (isAdminPublic(req)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protect all /admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth.protect();

    // Fetch the actual user from Clerk to get their real primary email
    // (sessionClaims does NOT contain email for Google OAuth by default)
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? "";

    if (ADMIN_EMAIL && primaryEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
