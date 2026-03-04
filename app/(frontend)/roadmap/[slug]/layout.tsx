type Props = {
  children: React.ReactNode;
};

export default function RoadmapDetailLayout({ children }: Props) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "var(--background)" }}
    >
      <main className="flex flex-1 flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}
