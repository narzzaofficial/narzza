"use client";

import { useState } from "react";
import { FloatingActions, useFloating } from "./FloatingActions";
import { BugReportForm, SuggestionForm } from "./FeedbackForms";

type View = "menu" | "bug" | "suggestion";

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

/* ── Inner panel — needs access to close via context ─────────────── */
function FeedbackPanel() {
  const { close } = useFloating();
  const [view, setView] = useState<View>("menu");

  const back = () => setView("menu");

  if (view === "bug") {
    return (
      <>
        <FloatingActions.Header
          title="🐛 Laporkan Bug"
          subtitle="Bantu kami meningkatkan kualitas"
          onClose={close}
        />
        <FloatingActions.Body>
          <button
            type="button"
            onClick={back}
            className="mb-3 flex items-center gap-1 text-xs transition hover:opacity-80"
            style={{ color: "var(--text-accent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Kembali
          </button>
          <BugReportForm onSuccess={() => setTimeout(close, 1800)} />
        </FloatingActions.Body>
      </>
    );
  }

  if (view === "suggestion") {
    return (
      <>
        <FloatingActions.Header
          title="💡 Rekomendasikan Konten"
          subtitle="Ada ide topik yang ingin dibahas?"
          onClose={close}
        />
        <FloatingActions.Body>
          <button
            type="button"
            onClick={back}
            className="mb-3 flex items-center gap-1 text-xs transition hover:opacity-80"
            style={{ color: "var(--text-accent)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Kembali
          </button>
          <SuggestionForm onSuccess={() => setTimeout(close, 1800)} />
        </FloatingActions.Body>
      </>
    );
  }

  // Default: menu
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
            onClick: () => setView("bug"),
          },
          {
            icon: "💡",
            label: "Rekomendasikan Konten",
            description: "Usulkan artikel, tutorial, atau topik baru",
            onClick: () => setView("suggestion"),
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

