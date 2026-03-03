 import { CONTACT_INFO } from "@/constants/about";

const ContactSection = () => {
  return (
    <section className="glass-panel rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/5">
      <h2 className="mb-2 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
        Hubungi Kami
      </h2>
      <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
        Tertarik untuk berkolaborasi, partnership, atau punya pertanyaan? Kami
        siap mendengar Anda.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACT_INFO.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border p-4 transition-colors"
            style={{
              borderColor: "var(--surface-border)",
              background: "var(--surface)",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </p>
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-accent)" }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactSection;
