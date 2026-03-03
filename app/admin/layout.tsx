import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminUserButton from "./_components/AdminUserButton";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

const PUBLIC_ADMIN_PATHS = ["/admin/sign-in", "/admin/unauthorized"];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Skip auth check for public admin pages (sign-in, unauthorized)
  const isPublicPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));
  if (isPublicPath) {
    return <>{children}</>;
  }

  const user = await currentUser();

  if (!user) {
    redirect("/admin/sign-in");
  }

  // Check if the signed-in user's email matches the allowed admin email
  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  if (ADMIN_EMAIL && primaryEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="admin-surface">
      {/* Admin Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-700/50 bg-slate-900/80 px-4 py-2 backdrop-blur">
        <span className="text-xs font-semibold text-slate-400 tracking-wide">
          🛠️ Admin Panel
        </span>
        <AdminUserButton />
      </div>
      {children}
    </div>
  );
}
