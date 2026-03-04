"use client";

import React from "react";

type AdsProps = {
  label: string;
  size: string;
  /** Optional: "banner" | "square" | "native" — affects aspect ratio */
  variant?: "banner" | "square" | "native";
};

const AdsPlaceholder = ({ label, size, variant = "square" }: AdsProps) => {
  const heightClass =
    variant === "banner"
      ? "h-[90px]"
      : variant === "native"
      ? "h-[120px]"
      : "h-[250px]";

  return (
    <div className="sidebar-widget overflow-hidden">
      <p
        className="mb-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      <div
        className={`flex ${heightClass} w-full items-center justify-center rounded-xl border border-dashed text-xs`}
        style={{
          borderColor: "var(--surface-border)",
          color: "var(--text-secondary)",
          background: "var(--surface)",
        }}
      >
        {size}
      </div>
    </div>
  );
};

export default AdsPlaceholder;
