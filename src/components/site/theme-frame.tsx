"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useLayoutEffect, useState } from "react";

import type { ThemeName } from "@/lib/content/types";

const ThemeOverride = createContext<(theme: ThemeName | null) => void>(() => {});

function themeFromPath(pathname: string): ThemeName {
  if (pathname === "/professional" || pathname.startsWith("/professional/")) return "professional";
  if (pathname === "/home-grinders" || pathname.startsWith("/home-grinders/")) return "home";
  return "neutral";
}

export function ThemeFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [override, setOverride] = useState<ThemeName | null>(null);
  const theme = override ?? themeFromPath(pathname);
  return (
    <ThemeOverride.Provider value={setOverride}>
      <div data-theme={theme} className="flex min-h-full flex-1 flex-col bg-bg text-fg">
        {children}
      </div>
    </ThemeOverride.Provider>
  );
}

export function ThemeLock({ theme }: { theme: ThemeName }) {
  const setOverride = useContext(ThemeOverride);
  useLayoutEffect(() => {
    setOverride(theme);
    return () => setOverride(null);
  }, [setOverride, theme]);
  return null;
}
