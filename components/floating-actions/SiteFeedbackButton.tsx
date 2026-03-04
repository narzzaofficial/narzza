"use client";

import { FloatingActions, useFloating } from "./FloatingActions";

/* ── N logo trigger icon ──────────────────────────────────────────── */
function NLogo() {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-black"
      style={{
        background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))",
        color: "var(--text-accent)",
        border: "1px solid rgba(6,182,212,0.3)",
      }}
    >
      N
    </span>
  );
}

/* ── Inner panel ─────────────────────────────────────────────────── */
function FeedbackPanel() {
  const { close } = useFloating();

  return (
    <>
      <FloatingActions.Header
        title="Narzza"
        subtitle="Ada yang bisa kami bantu?"
        onClose={close}
      />
      <FloatingActions.Menu
        items={[
          {
            icon: "🐛",
            label: "Laporkan Bug",
            description: "Temukan sesuatu yang tidak berfungsi?",
            href: "/laporkan-bug",
            onClick: close,
          },
          {
            icon: "💡",
            label: "Rekomendasikan Konten",
            description: "Usulkan artikel, tutorial, atau topik baru",
            href: "/rekomendasikan",
            onClick: close,
          },
        ]}
      />
      <FloatingActions.Footer>
        <p className="text-center text-[10px]" style={{ color: "var(--text-secondary)" }}>
          Feedback kamu sangat berarti untuk kami 🙏
        </p>
      </FloatingActions.Footer>
    </>
  );
}

/* ── Export ──────────────────────────────────────────────────────── */
export function SiteFeedbackButton() {
  return (
    <FloatingActions
      trigger={<NLogo />}
      position="bottom-right"
      tailwindOffset="bottom-6 right-5"
      ariaLabel="Feedback & Laporan"
    >
      <FeedbackPanel />
    </FloatingActions>
  );
}

