import { MobileNavDrawer } from "@/components/navigation/MobileNavDrawer";

type Props = {
  children: React.ReactNode;
};

export default function RoadmapDetailLayout({ children }: Props) {
  return (
    <>
      {/* Full-width Coursera-style — no sidebars */}
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-4 md:px-6 md:py-6">
          {children}
        </main>
      </div>
      <MobileNavDrawer activePath={`/roadmap`} />
    </>
  );
}
