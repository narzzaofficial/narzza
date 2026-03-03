import Link from "next/link";

const QUICK_LINKS = [
  { label: "Berita", href: "/berita", icon: "📰" },
  { label: "Tutorial", href: "/tutorial", icon: "🎓" },
  { label: "Riset", href: "/riset", icon: "🔬" },
  { label: "Buku", href: "/buku", icon: "📚" },
  { label: "Roadmap", href: "/roadmap", icon: "🗺️" },
  { label: "Toko", href: "/toko", icon: "🛒" },
];

const QuickAccessSection = () => {
  return (
    <section className="sidebar-widget">
      <h2 className="widget-heading">Quick Access</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {QUICK_LINKS.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition hover:border-cyan-400/50"
            style={{
              borderColor: "var(--surface-border)",
              background: "var(--surface)",
            }}
          >
            <span className="text-xl">{icon}</span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickAccessSection;
