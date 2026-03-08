export default function RoadmapAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen px-4 py-6"
      style={{ background: "var(--background)", color: "var(--text-primary)" }}
    >
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </div>
  );
}
