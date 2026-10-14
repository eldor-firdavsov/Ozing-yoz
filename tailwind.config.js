/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Outfit'", "'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      colors: {
        bg: "#F8FAFC",
        surface: "rgba(255, 255, 255, 0.72)",
        "surface-2": "rgba(241, 245, 249, 0.85)",
        border: "rgba(226, 232, 240, 0.9)",
        text: "#0F172A",
        muted: "#64748B",
        brand: {
          DEFAULT: "#65A30D", // High-contrast lime-green for white bg
          light: "#ECFCCB",
          glow: "#A3E635",
        },
        hint: {
          1: "#0284C7", // Sky blue (Savol)
          2: "#D97706", // Amber (Yo'nalish)
          3: "#EA580C", // Orange (Tushuntirish)
          4: "#E11D48", // Rose (Qisman yechim)
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(15, 23, 42, 0.05)",
        "glass-sm": "0 4px 16px 0 rgba(15, 23, 42, 0.04)",
        "glass-lg": "0 16px 48px 0 rgba(15, 23, 42, 0.08)",
        focus: "0 0 0 3px rgba(101, 163, 13, 0.22)",
      },
    },
  },
  plugins: [],
};
