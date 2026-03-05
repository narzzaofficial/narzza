"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(false);
  const prevPathRef = useRef(pathname);

  const finish = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    activeRef.current = false;
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  }, []);

  const start = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    setVisible(true);
    setProgress(20);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) {
          clearInterval(intervalRef.current!);
          return 85;
        }
        return Math.min(p + Math.random() * 12, 85);
      });
    }, 300);
  }, []);

  // Use a ref so the click handler always calls the latest start()
  const startRef = useRef(start);
  useEffect(() => {
    startRef.current = start;
  }, [start]);

  // Register click handler once — never stale because it calls via ref
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("#")
      )
        return;
      if (href === window.location.pathname) return;
      startRef.current();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Finish bar when pathname changes (navigation complete)
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      if (activeRef.current) {
        setTimeout(() => finishRef.current(), 0);
      }
    }
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${progress}%`,
        opacity: visible ? 1 : 0,
        zIndex: 99999,
        pointerEvents: "none",
        transition:
          progress === 100
            ? "width 0.25s ease, opacity 0.3s ease 0.15s"
            : progress === 0
              ? "none"
              : "width 0.35s ease",
        background: "linear-gradient(90deg, #0284c7, #06b6d4, #67e8f9)",
        boxShadow: "0 0 8px rgba(6, 182, 212, 0.8)",
      }}
    />
  );
}
