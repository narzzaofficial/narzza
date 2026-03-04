"use client";

import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DrawerHeader, MenuButton, NavigationSection } from ".";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

// Helper agar class Tailwind lebih enak dibaca
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MobileNavDrawerProps = {
  activePath: string;
};

export function MobileNavDrawer({ activePath }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Logic: Lock Scroll saat Drawer terbuka
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  const toggleDrawer = () => setIsOpen((prev) => !prev);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* 1. Mobile Top Bar */}
      <header className="mobile-topbar">
        <div className="flex items-center justify-between">
          <p
            className="text-sm font-semibold tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            Narzza Media Digital
          </p>
          <div className="flex items-center gap-2">
            <MenuButton onClick={toggleDrawer} />
          </div>
        </div>
      </header>

      {/* 2. Overlay & Panel */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isOpen
            ? "pointer-events-auto"
            : "pointer-events-none visibility-hidden"
        )}
      >
        {/* Dark Background Overlay */}
        <div
          className={cn(
            "drawer-overlay transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={closeDrawer}
        />

        {/* Sidebar Panel */}
        <aside
          className={cn(
            "mobile-drawer flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header */}
          <DrawerHeader onClose={closeDrawer} />

          {/* Divider */}
          <div className="drawer-divider mb-3" />

          {/* Nav links — scrollable */}
          <div className="flex-1 overflow-y-auto">
            <NavigationSection
              activePath={activePath}
              onNavigate={closeDrawer}
            />
          </div>

          {/* Footer: theme toggle */}
          <div className="drawer-divider mt-3 mb-3" />
          <div className="px-1">
            <ThemeToggle />
          </div>
        </aside>
      </div>
    </>
  );
}
