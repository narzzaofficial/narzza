"use client";

/**
 * FloatingActions — reusable floating action button with a panel.
 *
 * Usage:
 *   <FloatingActions
 *     trigger={<MyIcon />}
 *     position="bottom-right"
 *     offset={{ bottom: 6, right: 6 }}
 *   >
 *     <FloatingActions.Panel>...</FloatingActions.Panel>
 *   </FloatingActions>
 */

import {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  type CSSProperties,
} from "react";
import Link from "next/link";

/* ── Context ─────────────────────────────────────────────────────── */
type FloatingCtx = { close: () => void };
const FloatingContext = createContext<FloatingCtx>({ close: () => {} });
export const useFloating = () => useContext(FloatingContext);

/* ── Types ───────────────────────────────────────────────────────── */
type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left";

type FloatingActionsProps = {
  /** What renders as the trigger button */
  trigger: ReactNode;
  /** Where the trigger + panel anchor */
  position?: Position;
  /** Offset from the edge in Tailwind rem units (tailwind `bottom-N right-N`) */
  tailwindOffset?: string; // e.g. "bottom-6 right-6"
  children: ReactNode;
  /** Accessible label for the trigger */
  ariaLabel?: string;
};

/* ── Position → panel origin mapping ────────────────────────────── */
const PANEL_ORIGIN: Record<Position, CSSProperties> = {
  "bottom-right": { bottom: "calc(100% + 12px)", right: 0 },
  "bottom-left": { bottom: "calc(100% + 12px)", left: 0 },
  "top-right": { top: "calc(100% + 12px)", right: 0 },
  "top-left": { top: "calc(100% + 12px)", left: 0 },
};

/* ── Main component ──────────────────────────────────────────────── */
export function FloatingActions({
  trigger,
  position = "bottom-right",
  tailwindOffset = "bottom-6 right-5",
  children,
  ariaLabel = "Aksi cepat",
}: FloatingActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <FloatingContext.Provider value={{ close: () => setOpen(false) }}>
      <div
        ref={ref}
        className={`fixed z-50 ${tailwindOffset}`}
        style={{ position: "fixed" }}
      >
        {/* Panel */}
        {open && (
          <div
            className="absolute w-80 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl"
            style={{
              ...PANEL_ORIGIN[position],
              background: "var(--surface)",
              borderColor: "var(--surface-border)",
              backdropFilter: "blur(20px)",
            }}
          >
            {children}
          </div>
        )}

        {/* Trigger */}
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
            open ? "rotate-45" : "rotate-0"
          }`}
          style={{
            background: open
              ? "rgba(6,182,212,0.2)"
              : "var(--surface)",
            borderColor: "rgba(6,182,212,0.4)",
            color: "var(--text-accent)",
          }}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            trigger
          )}
        </button>
      </div>
    </FloatingContext.Provider>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

/** Panel header with title and optional close button */
FloatingActions.Header = function Header({
  title,
  subtitle,
  onClose,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className="flex items-start justify-between gap-2 border-b px-4 py-3"
      style={{ borderColor: "var(--surface-border)" }}
    >
      <div>
        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition hover:bg-white/10"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Tutup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

/** Scrollable panel body */
FloatingActions.Body = function Body({ children }: { children: ReactNode }) {
  return (
    <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
      {children}
    </div>
  );
};

/** Panel footer */
FloatingActions.Footer = function Footer({ children }: { children: ReactNode }) {
  return (
    <div
      className="border-t px-4 py-3"
      style={{ borderColor: "var(--surface-border)" }}
    >
      {children}
    </div>
  );
};

/** List of action items shown before selecting a form */
FloatingActions.Menu = function Menu({
  items,
}: {
  items: { icon: ReactNode; label: string; description?: string; href?: string; onClick: () => void }[];
}) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3">
      {items.map((item, i) => {
        const inner = (
          <>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}
            >
              {item.icon}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </p>
              {item.description && (
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {item.description}
                </p>
              )}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-secondary)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </>
        );

        if (item.href) {
          return (
            <Link
              key={i}
              href={item.href}
              onClick={item.onClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5 active:scale-[0.98]"
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={i}
            type="button"
            onClick={item.onClick}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5 active:scale-[0.98]"
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
};

