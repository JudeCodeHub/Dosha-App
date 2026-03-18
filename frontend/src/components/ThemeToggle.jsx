import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const getInitialTheme = () => {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return saved ? saved === "dark" : prefersDark;
};

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark((prev) => !prev)}
      className="h-11 w-11 rounded-full flex items-center justify-center text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-white/10 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-30 w-30" />
      ) : (
        <Moon className="h-30 w-30" />
      )}
    </Button>
  );
};

export default ThemeToggle;
