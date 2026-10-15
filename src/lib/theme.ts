// Theme Manager for Light / Dark Mode
export type ThemeMode = "light" | "dark";

class ThemeManager {
  private currentTheme: ThemeMode = "light";
  private listeners: Set<(theme: ThemeMode) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ozing_yoz_theme") as ThemeMode | null;
      if (saved === "dark" || saved === "light") {
        this.currentTheme = saved;
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        this.currentTheme = "dark";
      }
      this.applyTheme();
    }
  }

  public getTheme(): ThemeMode {
    return this.currentTheme;
  }

  public isDark(): boolean {
    return this.currentTheme === "dark";
  }

  public toggle(): ThemeMode {
    this.setTheme(this.currentTheme === "dark" ? "light" : "dark");
    return this.currentTheme;
  }

  public setTheme(theme: ThemeMode) {
    this.currentTheme = theme;
    if (typeof window !== "undefined") {
      localStorage.setItem("ozing_yoz_theme", theme);
    }
    this.applyTheme();
    this.listeners.forEach((l) => l(theme));
  }

  public subscribe(listener: (theme: ThemeMode) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private applyTheme() {
    if (typeof document !== "undefined") {
      if (this.currentTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }
}

export const themeManager = new ThemeManager();
