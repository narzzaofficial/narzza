import { MobileNavDrawer } from "@/components/navigation/MobileNavDrawer";

type Props = {
  children: React.ReactNode;
};

export default function RoadmapDetailLayout({ children }: Props) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "var(--background)" }}
    >
      {/* ── Page content ────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col min-h-0">
        {children}
      </main>

      <MobileNavDrawer activePath="/roadmap" />
    </div>
  );
}
