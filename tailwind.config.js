/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        trust: "#1d4ed8",
        civic: "#0f766e",
        surface: "#f8fafc",
        line: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 24px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
