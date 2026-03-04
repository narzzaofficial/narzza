"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
};

export function ThemeLogo({ className = "w-24 object-contain" }: Props) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Read initial value
    const read = () =>
      (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(read());

    // Watch for any future changes to data-theme on <html>
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Image
      src={theme === "light" ? "/logo.png" : "/dark-logo.png"}
      alt="Narzza Logo"
      width={200}
      height={200}
      className={className}
    />
  );
}
