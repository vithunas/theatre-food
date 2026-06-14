/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        gold: "var(--gold)",
        "gold-hover": "var(--gold-hover)",
        primary: "var(--text-primary)",
        muted: "var(--text-muted)",
        success: "var(--success)",
        danger: "var(--danger)",
        amber: "var(--amber)",
        hairline: "var(--border)",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
