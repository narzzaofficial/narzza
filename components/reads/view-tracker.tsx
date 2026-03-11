"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  feedId: number;
}

/**
 * Komponen invisible yang hanya bertugas memanggil POST /api/feeds/[id]/view
 * satu kali saat artikel dibuka — untuk increment popularity counter.
 * Menggunakan ref untuk mencegah double-call di React StrictMode.
 */
export function ViewTracker({ feedId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch(`/api/feeds/${feedId}/view`, { method: "POST" }).catch(() => {
      // Tracking failure tidak perlu diblok — silent fail
    });
  }, [feedId]);

  return null; // tidak render apapun ke DOM
}
