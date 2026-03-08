"use client";

import { navIcons, navLink } from "@/constants";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NavigationSectionProps = {
  activePath: string;
  onNavigate?: () => void;
};

const NavigationSection = ({
  activePath,
  onNavigate,
}: NavigationSectionProps) => {
  return (
    <nav className="space-y-1.5">
      {navLink.map((item) => {
        const isActive = activePath === item.href;
        const icon = navIcons[item.href] ?? "•";

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-150",
              isActive ? "nav-item-active" : "nav-item"
            )}
          >
            {/* Active left bar */}
            {isActive && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan-400" />
            )}

            {/* Icon */}
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition-all",
                isActive ? "nav-icon-active" : "nav-icon"
              )}
            >
              {icon}
            </span>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-semibold leading-none",
                  isActive ? "nav-title-active" : "nav-title"
                )}
              >
                {item.title}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-[11px] leading-none",
                  isActive ? "nav-note-active" : "nav-note"
                )}
              >
                {item.note}
              </p>
            </div>

            {/* Active chevron */}
            {isActive && (
              <svg
                className="h-3.5 w-3.5 shrink-0 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationSection;
