"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${className}`}
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
      />
    </button>
  );
}
