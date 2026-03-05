"use client";

import { usePathname } from "next/navigation";
import { NavigationSection, MobileNavDrawer } from ".";
import { ThemeToggle } from "./ThemeToggle";
import { SiteFeedbackButton } from "@/components/floating-actions/SiteFeedbackButton";

export function ShellActiveNav() {
  const activePath = usePathname();
  return (
    <>
      <NavigationSection activePath={activePath} />
      <div className="drawer-divider my-3" />
      <ThemeToggle />
      <MobileNavDrawer activePath={activePath} />
      <SiteFeedbackButton />
    </>
  );
}
