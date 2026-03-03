// This layout intentionally skips the AdminLayout (auth check) wrapper.
// Routes in this group: /admin/sign-in, /admin/unauthorized
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

