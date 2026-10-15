/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Nunito'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Outfit'", "'Nunito'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        bg: "#FFFFFF",
        surface: "#FFFFFF",
        "surface-2": "#F7F7F7",
        border: "#E5E5E5",
        text: "#3C3C3C",
        muted: "#777777",
        duo: {
          green: "#58CC02",
          "green-dark": "#46A302",
          "green-light": "#D7FFB8",
          blue: "#1CB0F6",
          "blue-dark": "#1899D6",
          "blue-light": "#DDF4FF",
          orange: "#FF9600",
          "orange-dark": "#E07D00",
          "orange-light": "#FFEDB3",
          red: "#FF4B4B",
          "red-dark": "#EA2B2B",
          yellow: "#FFC800",
          "yellow-dark": "#E5B400",
          purple: "#CE82FF",
          "purple-dark": "#A55EEA",
          card: "#FFFFFF",
          border: "#E5E5E5",
        },
        mondly: {
          teal: "#0D9488",
          emerald: "#10B981",
          sky: "#0284C7",
          navy: "#0F172A",
          slate: "#1E293B",
          surface: "#F8FAFC",
          card: "#FFFFFF",
          accent: "#F59E0B",
        },
        brand: {
          DEFAULT: "#10B981", // Mondly emerald
          light: "#D1FAE5",
          glow: "#34D399",
          dark: "#059669",
        },
        hint: {
          1: "#0284C7", // Sky blue (Savol)
          2: "#F59E0B", // Amber (Yo'nalish)
          3: "#8B5CF6", // Purple (Tushuntirish)
          4: "#EF4444", // Rose (Qisman yechim)
        },
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        glass: "0 8px 32px 0 rgba(15, 23, 42, 0.05)",
        "glass-sm": "0 4px 16px 0 rgba(15, 23, 42, 0.04)",
        "glass-lg": "0 16px 48px 0 rgba(15, 23, 42, 0.08)",
        focus: "0 0 0 3px rgba(101, 163, 13, 0.22)",
      },
    },
  },
  plugins: [],
};
