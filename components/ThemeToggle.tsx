/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 dark:hover:bg-white/10 transition-all duration-300 shadow-sm"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
}